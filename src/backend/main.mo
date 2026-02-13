import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Float "mo:core/Float";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Type Definitions (Directly in the main file)
  type PatientId = Principal;
  type ProviderId = Principal;
  type ConsultationStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };
  type ConsultationId = Text;
  type FitnessId = Text;
  type MembershipId = Text;

  // Comparison modules
  module Provider {
    public func compare(a : { id : Principal; name : Text }, b : { id : Principal; name : Text }) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module Consultation {
    public func compareByTime(a : { id : Text; time : Time.Time }, b : { id : Text; time : Time.Time }) : Order.Order {
      if (a.time < b.time) { #less } else if (a.time > b.time) {
        #greater;
      } else { #equal };
    };
  };

  module FitnessListing {
    public func compare(a : { id : Text; name : Text }, b : { id : Text; name : Text }) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module MembershipPlan {
    public func compare(a : { id : Text; price : Float }, b : { id : Text; price : Float }) : Order.Order {
      Float.compare(a.price, b.price);
    };
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data stores
  let providers = Map.empty<ProviderId, Provider>();
  let patients = Map.empty<PatientId, PatientProfile>();
  let consultations = Map.empty<ConsultationId, Consultation>();
  let fitnessListings = Map.empty<FitnessId, FitnessListing>();
  let memberships = Map.empty<MembershipId, MembershipPlan>();

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?PatientProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    patients.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?PatientProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    patients.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : PatientProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    patients.add(caller, profile);
  };

  // Providers
  public shared ({ caller }) func addProvider(profile : Provider) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add providers");
    };
    providers.add(profile.id, profile);
  };

  public query func listProviders() : async [Provider] {
    providers.values().toArray().sort();
  };

  public query func getProvider(id : ProviderId) : async Provider {
    switch (providers.get(id)) {
      case (?provider) { provider };
      case (null) { Runtime.trap("Provider not found") };
    };
  };

  // Patient Profiles (Legacy - kept for backward compatibility)
  public shared ({ caller }) func savePatientProfile(profile : PatientProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    patients.add(caller, profile);
  };

  public query ({ caller }) func getPatientProfile() : async PatientProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    switch (patients.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Patient profile not found") };
    };
  };

  // Consultations
  public shared ({ caller }) func requestConsultation(request : ConsultationRequest) : async ConsultationId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can request consultations");
    };
    // Verify the caller is requesting for themselves
    if (request.patientId != caller) {
      Runtime.trap("Unauthorized: Can only request consultations for yourself");
    };
    // Verify provider exists
    switch (providers.get(request.providerId)) {
      case (null) { Runtime.trap("Provider not found") };
      case (?_) {};
    };
    let id = caller.toText() # "_" # Time.now().toText();
    let consultation : Consultation = {
      id;
      patientId = request.patientId;
      providerId = request.providerId;
      modality = request.modality;
      time = request.time;
      status = #pending;
      notes = request.notes;
    };
    consultations.add(id, consultation);
    id;
  };

  public query ({ caller }) func getConsultations() : async [Consultation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view consultations");
    };
    // Filter consultations: users see only their own, admins see all
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let allConsultations = consultations.values().toArray();
    if (isAdmin) {
      allConsultations.sort(Consultation.compareByTime);
    } else {
      allConsultations.filter(
        func(c) { c.patientId == caller or c.providerId == caller }
      ).sort(Consultation.compareByTime);
    };
  };

  public shared ({ caller }) func updateConsultationStatus(
    consultationId : ConsultationId,
    newStatus : ConsultationStatus,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update consultations");
    };
    let consultation = switch (consultations.get(consultationId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Consultation not found") };
    };
    // Only the patient, provider, or admin can update status
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not (caller == consultation.patientId or caller == consultation.providerId or isAdmin)) {
      Runtime.trap("Unauthorized: Can only update your own consultations");
    };
    let updated = {
      consultation with
      status = newStatus;
    };
    consultations.add(consultationId, updated);
  };

  // Fitness Listings
  public shared ({ caller }) func addFitnessListing(listing : FitnessListing) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add fitness listings");
    };
    fitnessListings.add(listing.id, listing);
  };

  public shared ({ caller }) func updateFitnessListing(listing : FitnessListing) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update fitness listings");
    };
    switch (fitnessListings.get(listing.id)) {
      case (null) { Runtime.trap("Fitness listing not found") };
      case (?_) { fitnessListings.add(listing.id, listing) };
    };
  };

  public shared ({ caller }) func deleteFitnessListing(id : FitnessId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete fitness listings");
    };
    fitnessListings.remove(id);
  };

  public query func listFitnessListings() : async [FitnessListing] {
    fitnessListings.values().toArray().sort();
  };

  // Memberships
  public shared ({ caller }) func addMembershipPlan(plan : MembershipPlan) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add membership plans");
    };
    memberships.add(plan.id, plan);
  };

  public shared ({ caller }) func updateMembershipPlan(plan : MembershipPlan) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update membership plans");
    };
    switch (memberships.get(plan.id)) {
      case (null) { Runtime.trap("Membership plan not found") };
      case (?_) { memberships.add(plan.id, plan) };
    };
  };

  public shared ({ caller }) func deleteMembershipPlan(id : MembershipId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete membership plans");
    };
    memberships.remove(id);
  };

  public query func listMembershipPlans() : async [MembershipPlan] {
    memberships.values().toArray().sort(MembershipPlan.compare);
  };

  // VIP Treatment
  public shared ({ caller }) func setVIPStatus(patientId : PatientId, isVIP : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set VIP status");
    };
    let profile = switch (patients.get(patientId)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Patient not found") };
    };
    let updatedProfile = {
      profile with
      isVIP;
    };
    patients.add(patientId, updatedProfile);
  };

  public query ({ caller }) func getVIPStatus() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can check VIP status");
    };
    switch (patients.get(caller)) {
      case (?profile) { profile.isVIP };
      case (null) { false };
    };
  };

  // Type Definitions (Directly in the main file)
  type PatientProfile = {
    id : PatientId;
    name : Text;
    age : Nat;
    description : Text;
    isVIP : Bool;
    preferences : Text;
  };

  type Provider = {
    id : Principal;
    name : Text;
    specialization : Text;
    location : Text;
    online : Bool;
  };

  type Consultation = {
    id : ConsultationId;
    patientId : PatientId;
    providerId : ProviderId;
    modality : Text; // "online" | "offline"
    time : Time.Time;
    status : ConsultationStatus;
    notes : Text;
  };

  type ConsultationRequest = {
    patientId : PatientId;
    providerId : ProviderId;
    modality : Text;
    time : Time.Time;
    notes : Text;
  };

  type FitnessListing = {
    id : FitnessId;
    name : Text;
    location : Text;
    typeOfClass : Text;
    online : Bool;
    cost : Float;
    duration : Float;
  };

  type MembershipPlan = {
    id : MembershipId;
    name : Text;
    description : Text;
    price : Float;
    duration : Float;
  };
};

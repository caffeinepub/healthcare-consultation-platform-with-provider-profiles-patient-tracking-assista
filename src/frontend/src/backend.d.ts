import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type MembershipId = string;
export interface ConsultationRequest {
    patientId: PatientId;
    time: Time;
    modality: string;
    notes: string;
    providerId: ProviderId;
}
export type FitnessId = string;
export type ConsultationId = string;
export type PatientId = Principal;
export type ProviderId = Principal;
export interface PatientProfile {
    id: PatientId;
    age: bigint;
    name: string;
    description: string;
    preferences: string;
    isVIP: boolean;
}
export interface MembershipPlan {
    id: MembershipId;
    duration: number;
    name: string;
    description: string;
    price: number;
}
export interface FitnessListing {
    id: FitnessId;
    duration: number;
    cost: number;
    name: string;
    typeOfClass: string;
    location: string;
    online: boolean;
}
export interface Consultation {
    id: ConsultationId;
    status: ConsultationStatus;
    patientId: PatientId;
    time: Time;
    modality: string;
    notes: string;
    providerId: ProviderId;
}
export interface Provider {
    id: Principal;
    name: string;
    specialization: string;
    location: string;
    online: boolean;
}
export enum ConsultationStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFitnessListing(listing: FitnessListing): Promise<void>;
    addMembershipPlan(plan: MembershipPlan): Promise<void>;
    addProvider(profile: Provider): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteFitnessListing(id: FitnessId): Promise<void>;
    deleteMembershipPlan(id: MembershipId): Promise<void>;
    getCallerUserProfile(): Promise<PatientProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConsultations(): Promise<Array<Consultation>>;
    getPatientProfile(): Promise<PatientProfile>;
    getProvider(id: ProviderId): Promise<Provider>;
    getUserProfile(user: Principal): Promise<PatientProfile | null>;
    getVIPStatus(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listFitnessListings(): Promise<Array<FitnessListing>>;
    listMembershipPlans(): Promise<Array<MembershipPlan>>;
    listProviders(): Promise<Array<Provider>>;
    requestConsultation(request: ConsultationRequest): Promise<ConsultationId>;
    saveCallerUserProfile(profile: PatientProfile): Promise<void>;
    savePatientProfile(profile: PatientProfile): Promise<void>;
    setVIPStatus(patientId: PatientId, isVIP: boolean): Promise<void>;
    updateConsultationStatus(consultationId: ConsultationId, newStatus: ConsultationStatus): Promise<void>;
    updateFitnessListing(listing: FitnessListing): Promise<void>;
    updateMembershipPlan(plan: MembershipPlan): Promise<void>;
}

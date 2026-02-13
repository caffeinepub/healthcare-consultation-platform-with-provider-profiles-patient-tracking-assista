import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  Provider,
  PatientProfile,
  Consultation,
  ConsultationRequest,
  FitnessListing,
  MembershipPlan,
  UserRole,
} from '../backend';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PatientProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: PatientProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// User Role
export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserRole>({
    queryKey: ['userRole', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Providers
export function useListProviders() {
  const { actor, isFetching } = useActor();

  return useQuery<Provider[]>({
    queryKey: ['providers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProviders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProvider(providerId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Provider>({
    queryKey: ['provider', providerId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProvider(providerId as any);
    },
    enabled: !!actor && !isFetching && !!providerId,
  });
}

export function useAddProvider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: Provider) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProvider(provider);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
}

// Consultations
export function useGetConsultations() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Consultation[]>({
    queryKey: ['consultations', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConsultations();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useRequestConsultation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ConsultationRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestConsultation(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}

export function useUpdateConsultationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      consultationId,
      newStatus,
    }: {
      consultationId: string;
      newStatus: any;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateConsultationStatus(consultationId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}

// Fitness
export function useListFitnessListings() {
  const { actor, isFetching } = useActor();

  return useQuery<FitnessListing[]>({
    queryKey: ['fitnessListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFitnessListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFitnessListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: FitnessListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFitnessListing(listing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitnessListings'] });
    },
  });
}

export function useUpdateFitnessListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: FitnessListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFitnessListing(listing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitnessListings'] });
    },
  });
}

export function useDeleteFitnessListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFitnessListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitnessListings'] });
    },
  });
}

// Memberships
export function useListMembershipPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<MembershipPlan[]>({
    queryKey: ['membershipPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMembershipPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMembershipPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: MembershipPlan) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMembershipPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
    },
  });
}

export function useUpdateMembershipPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: MembershipPlan) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMembershipPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
    },
  });
}

export function useDeleteMembershipPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMembershipPlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
    },
  });
}

// VIP Status
export function useGetVIPStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['vipStatus', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getVIPStatus();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useSetVIPStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, isVIP }: { patientId: any; isVIP: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setVIPStatus(patientId, isVIP);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}


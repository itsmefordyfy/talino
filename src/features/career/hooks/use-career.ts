import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';

import { deleteApplication, deleteGoal, deleteIncome, readApplications, readGoals, readIncome, saveApplication, saveGoal, saveIncome, type ApplicationInput, type GoalInput, type IncomeInput } from '../api/career-repo';

export const careerKey = ['career'] as const;

/** Every application, payment and goal, from one read: the tracker is small enough to keep whole. */
export function useCareer() {
  return useDbQuery(careerKey, async (db) => {
    const [applications, income, goals] = await Promise.all([readApplications(db), readIncome(db), readGoals(db)]);
    return { applications, income, goals };
  });
}

export function useSaveApplication() {
  return useDbMutation((db, input: ApplicationInput) => saveApplication(db, input));
}

export function useDeleteApplication() {
  return useDbMutation((db, id: string) => deleteApplication(db, id));
}

export function useSaveIncome() {
  return useDbMutation((db, input: IncomeInput) => saveIncome(db, input));
}

export function useDeleteIncome() {
  return useDbMutation((db, id: string) => deleteIncome(db, id));
}

export function useSaveGoal() {
  return useDbMutation((db, input: GoalInput) => saveGoal(db, input));
}

export function useDeleteGoal() {
  return useDbMutation((db, id: string) => deleteGoal(db, id));
}

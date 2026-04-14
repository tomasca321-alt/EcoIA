import { supabase } from './supabase';
import { User } from '../types';

export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching user:', error);
    return null;
  }
  return data;
}

export async function createUser(user: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  return data;
}

export async function updateUserPoints(userId: string, pointsToAdd: number): Promise<User | null> {
  // First get current user
  const user = await getUser(userId);
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .update({ 
      puntos_mes: user.puntos_mes + pointsToAdd,
      puntos_total: user.puntos_total + pointsToAdd,
      clasificaciones: user.clasificaciones + 1,
      ultima_fecha: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user points:', error);
    return null;
  }
  return data;
}

export async function getLeaderboard(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('puntos_mes', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data;
}

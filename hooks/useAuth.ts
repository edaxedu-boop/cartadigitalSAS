import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface UserRole {
    role: 'super_admin' | 'restaurant_admin';
    restaurant_id?: string;
}

interface AuthState {
    user: User | null;
    session: Session | null;
    userRole: UserRole | null;
    loading: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        userRole: null,
        loading: true,
    });

    useEffect(() => {
        // Verificar sesión actual
        const checkSession = async () => {
            if (!supabase) {
                setAuthState({ user: null, session: null, userRole: null, loading: false });
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const role = await getUserRole(session.user.id);
                    setAuthState({
                        user: session.user,
                        session,
                        userRole: role,
                        loading: false,
                    });
                } else {
                    setAuthState({ user: null, session: null, userRole: null, loading: false });
                }
            } catch (error) {
                console.error('Error checking session:', error);
                setAuthState({ user: null, session: null, userRole: null, loading: false });
            }
        };

        checkSession();

        // Escuchar cambios de autenticación
        if (supabase) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth state changed:', event);

                if (session?.user) {
                    const role = await getUserRole(session.user.id);
                    setAuthState({
                        user: session.user,
                        session,
                        userRole: role,
                        loading: false,
                    });
                } else {
                    setAuthState({ user: null, session: null, userRole: null, loading: false });
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, []);

    const getUserRole = async (userId: string): Promise<UserRole | null> => {
        if (!supabase) return null;

        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role, restaurant_id')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error('Error fetching user role:', error);
                return null;
            }

            return data as UserRole;
        } catch (error) {
            console.error('Error in getUserRole:', error);
            return null;
        }
    };

    const signIn = async (email: string, password: string) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    };

    const signUp = async (email: string, password: string) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        if (!supabase) return;

        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        setAuthState({ user: null, session: null, userRole: null, loading: false });
    };

    return {
        ...authState,
        signIn,
        signUp,
        signOut,
        isSuperAdmin: authState.userRole?.role === 'super_admin',
        isRestaurantAdmin: authState.userRole?.role === 'restaurant_admin',
        restaurantId: authState.userRole?.restaurant_id,
    };
};

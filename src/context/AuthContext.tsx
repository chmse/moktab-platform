import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthProfile {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: 'professor' | 'student' | null;
    is_admin: boolean;
    rank?: string;
    department?: string;
    level?: string;
}

interface AuthContextType {
    user: User | null;
    profile: AuthProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<AuthProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        setLoading(true);
        console.log('Fetching profile for user:', userId);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile from Supabase:', error);
                throw error;
            }

            if (data) {
                setProfile(data as AuthProfile);
                console.log('Profile fetched successfully:', data.full_name);
            }
        } catch (err) {
            console.error('AuthContext: fetchProfile caught error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('AuthContext: Initializing auth state...');
        // 1. Check current session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('AuthContext: getSession error:', error);
                setLoading(false);
                return;
            }
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id);
            } else {
                console.log('AuthContext: No active session found.');
                setLoading(false);
            }
        }).catch((err) => {
            console.error('AuthContext: getSession promise rejected:', err);
            setLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: Auth event change:', event);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchProfile(currentUser.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            console.log('AuthContext: Cleaning up subscription');
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

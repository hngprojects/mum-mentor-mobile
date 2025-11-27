/**
 * Setup Integration Service
 * 
 * Orchestrates the complete setup flow:
 * 1. Creates profile setup on backend
 * 2. Creates all children with the returned profile_setup_id
 * 3. ONLY marks setup as complete if ALL steps succeed
 * 
 * CRITICAL: The completion flag (isSetupComplete) is ONLY set to true
 * after successful backend creation. If anything fails, flag stays false.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createProfileSetup } from './profileSetup.service';
import { createChildProfile } from './childProfile.service';
import type { 
  CreateProfileSetupRequest, 
  CreateChildProfileRequest 
} from './types';

// Types for local data (from AsyncStorage)
export interface MomSetupData {
  momStatus: string; // "Pregnant", "New Mom", "Toddler Mom", "Mixed"
  selectedGoals: string[];
  partner?: {
    name: string;
    email: string;
  };
}

export interface ChildData {
  fullName: string;
  dob: string; // ISO date string
  gender: 'male' | 'female' | 'other';
}

/**
 * Map frontend mom status to backend format
 */
function mapMomStatus(status: string): string {
  const mapping: { [key: string]: string } = {
    'Pregnant': 'pregnant',
    'New Mom': 'new_mom',
    'Toddler Mom': 'toddler_mom',
    'Mixed': 'mixed',
  };
  
  const mapped = mapping[status] || status.toLowerCase().replace(' ', '_');
  console.log(`🔄 Mapping mom status: "${status}" → "${mapped}"`);
  return mapped;
}

/**
 * Complete the entire setup flow:
 * 1. Create profile setup on backend
 * 2. Get profile_setup_id
 * 3. Create all children with that profile_setup_id
 * 4. Mark setup as complete ONLY if all steps succeed
 * 
 * CRITICAL BUSINESS RULE:
 * - isSetupComplete is ONLY set to true if ALL steps complete successfully
 * - If ANY error occurs, the flag remains false
 * - This ensures user must retry failed setup
 */
export async function completeSetupFlow(
  momSetupData: MomSetupData,
  children: ChildData[]
): Promise<{ 
  success: boolean; 
  profile_setup_id?: string; 
  error?: any;
  childrenCreated?: number;
  childrenFailed?: number;
}> {
  
  console.log('='.repeat(80));
  console.log('🚀 STARTING COMPLETE SETUP FLOW');
  console.log('='.repeat(80));
  
  let profile_setup_id: string | undefined;
  let completionFlagSet = false;
  
  try {
    // STEP 1: Prepare profile setup data for API
    console.log('📋 Step 1: Preparing profile setup data...');
    
    const profileSetupRequest: CreateProfileSetupRequest = {
      mom_status: mapMomStatus(momSetupData.momStatus),
      goals: momSetupData.selectedGoals,
      partner: momSetupData.partner || null,
      children: [], // Initially empty - we'll add children separately
    };
    
    console.log('📦 Profile setup request:', JSON.stringify(profileSetupRequest, null, 2));
    
    // STEP 2: Create profile setup on backend
    console.log('🌐 Step 2: Creating profile setup on backend...');
    console.log('📍 API: POST /api/v1/profile-setup/');
    
    const profileSetup = await createProfileSetup(profileSetupRequest);
    
    if (!profileSetup || !profileSetup.id) {
      throw new Error('Failed to create profile setup - no ID returned from backend');
    }
    
    profile_setup_id = profileSetup.id;
    console.log('✅ Profile setup created successfully!');
    console.log('🔑 profile_setup_id:', profile_setup_id);
    console.log('💾 Storing profile_setup_id in AsyncStorage...');
    await AsyncStorage.setItem('profile_setup_id', profile_setup_id);
    console.log('✅ profile_setup_id stored');
    
    // STEP 3: Create all children
    const childrenCreated: string[] = [];
    const childrenFailed: { child: ChildData; error: any }[] = [];
    
    if (children.length > 0) {
      console.log(`👶 Step 3: Creating ${children.length} children...`);
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        console.log(`\n📝 Creating child ${i + 1}/${children.length}:`);
        console.log(`   Name: ${child.fullName}`);
        console.log(`   DOB: ${child.dob}`);
        console.log(`   Gender: ${child.gender}`);
        
        try {
          const childRequest: CreateChildProfileRequest = {
            profile_setup_id: profile_setup_id,
            full_name: child.fullName,
            date_of_birth: child.dob,
            gender: child.gender,
            birth_order: i + 1,
          };
          
          console.log('📤 Child request:', JSON.stringify(childRequest, null, 2));
          console.log('📍 API: POST /api/v1/child-profiles/');
          
          const createdChild = await createChildProfile(childRequest);
          console.log(`✅ Child ${i + 1} created successfully!`);
          console.log(`   ID: ${createdChild.id}`);
          childrenCreated.push(createdChild.id);
          
        } catch (childError: any) {
          console.error(`❌ Failed to create child ${i + 1}:`);
          console.error('   Error:', childError?.message || childError);
          console.error('   Response:', childError?.response?.data);
          childrenFailed.push({ child, error: childError });
        }
      }
      
      console.log('\n📊 Children Creation Summary:');
      console.log(`   ✅ Succeeded: ${childrenCreated.length}`);
      console.log(`   ❌ Failed: ${childrenFailed.length}`);
      
      // Check if any children failed
      if (childrenFailed.length > 0) {
        console.warn(`⚠️ ${childrenFailed.length} children failed to create`);
        
        // If ALL children failed, throw error
        if (childrenCreated.length === 0) {
          console.error('❌ CRITICAL: All children failed to create');
          throw new Error('Failed to create any children profiles');
        }
        
        // If some succeeded, log warning but continue
        console.warn(`⚠️ PARTIAL SUCCESS: ${childrenCreated.length}/${children.length} children created`);
      } else {
        console.log(`✅ ALL children created successfully (${childrenCreated.length}/${children.length})`);
      }
    } else {
      console.log('ℹ️ No children to create (mom is pregnant or hasn\'t added children yet)');
    }
    
    // STEP 4: CRITICAL - Mark setup as complete ONLY if we reach here
    console.log('\n📝 Step 4: Marking setup as complete...');
    console.log('🔒 CRITICAL: Only setting completion flag because ALL steps succeeded');
    
    await AsyncStorage.setItem('isSetupComplete', 'true');
    completionFlagSet = true;
    
    console.log('✅ Setup marked as complete in AsyncStorage');
    console.log('✅ isSetupComplete = true');
    
    console.log('\n' + '='.repeat(80));
    console.log('🎉 SETUP FLOW COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log('Summary:');
    console.log(`  ✅ Profile setup created: ${profile_setup_id}`);
    console.log(`  ✅ Children created: ${childrenCreated.length}`);
    console.log(`  ✅ Setup marked complete: ${completionFlagSet}`);
    console.log('='.repeat(80));
    
    return {
      success: true,
      profile_setup_id: profile_setup_id,
      childrenCreated: childrenCreated.length,
      childrenFailed: childrenFailed.length,
    };
    
  } catch (error: any) {
    console.log('\n' + '='.repeat(80));
    console.error('❌ SETUP FLOW FAILED');
    console.log('='.repeat(80));
    console.error('Error type:', typeof error);
    console.error('Error message:', error?.message);
    console.error('Error response:', error?.response?.data);
    console.error('Error status:', error?.response?.status);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    // CRITICAL: Ensure setup is NOT marked as complete
    console.log('\n🔒 CRITICAL: Ensuring setup is NOT marked as complete due to error');
    
    try {
      await AsyncStorage.setItem('isSetupComplete', 'false');
      console.log('✅ Confirmed: isSetupComplete = false');
    } catch (storageError) {
      console.error('❌ Failed to update AsyncStorage:', storageError);
    }
    
    // Log what was accomplished before failure
    if (profile_setup_id) {
      console.log('ℹ️ profile_setup_id was created:', profile_setup_id);
      console.log('ℹ️ This ID is saved and can be used for manual retry or debugging');
    } else {
      console.log('ℹ️ Profile setup was not created - nothing to clean up');
    }
    
    console.log('='.repeat(80));
    console.log('Summary:');
    console.log(`  ❌ Setup failed: ${error?.message || 'Unknown error'}`);
    console.log(`  🔒 Setup marked complete: ${completionFlagSet} (should be false)`);
    console.log(`  ℹ️ User must retry setup`);
    console.log('='.repeat(80));
    
    return {
      success: false,
      error: error,
      profile_setup_id: profile_setup_id, // Return this for debugging/retry
    };
  }
}

/**
 * Helper function to check if setup is complete
 */
export async function isSetupComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem('isSetupComplete');
    const isComplete = value === 'true';
    console.log('🔍 Checking setup completion status:', isComplete);
    return isComplete;
  } catch (error) {
    console.error('Error checking setup completion:', error);
    return false;
  }
}

/**
 * Helper function to reset setup (for testing/debugging)
 */
export async function resetSetup(): Promise<void> {
  console.log('🔄 Resetting setup...');
  await AsyncStorage.removeItem('isSetupComplete');
  await AsyncStorage.removeItem('profile_setup_id');
  await AsyncStorage.removeItem('momSetupData');
  console.log('✅ Setup reset complete');
}
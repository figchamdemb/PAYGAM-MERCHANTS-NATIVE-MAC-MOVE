/**
 * MOCK AUTHENTICATION SERVICE
 * 
 * Used for testing until app is stable
 * Replace with real Firebase + API calls later
 * 
 * TODO: Replace with real auth from EGOVE-CITIZEN-APP-NEXTJS/services/auth.ts
 */

// Mock user data
export const MOCK_USERS = {
  '+2207123456': {
    id: 1,
    phone: '+2207123456',
    password: 'test1234',
    firstName: 'Fatou',
    lastName: 'Ceesay',
    username: 'fatou.ceesay',
    email: 'fatou@example.com',
    isVerified: true,
    registrationComplete: true,
  },
  '+2207654321': {
    id: 2,
    phone: '+2207654321',
    password: 'test1234',
    firstName: 'Lamin',
    lastName: 'Jallow',
    username: 'lamin.jallow',
    email: 'lamin@example.com',
    isVerified: true,
    registrationComplete: false,
    currentStep: 'personal', // personal, profile, address
  },
};

// Mock OTP - always use 123456 for testing
export const MOCK_OTP = '123456';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock send OTP
 * In real app: calls Firebase startPhoneSignIn
 */
export const mockSendOTP = async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
  await delay(1000); // Simulate network
  
  console.log('[MockAuth] Sending OTP to:', phoneNumber);
  
  // Always succeed for testing
  return {
    success: true,
    message: `OTP sent to ${phoneNumber}. Use code: ${MOCK_OTP}`,
  };
};

/**
 * Mock verify OTP
 * In real app: calls Firebase confirmCode
 */
export const mockVerifyOTP = async (
  phoneNumber: string,
  otp: string
): Promise<{ success: boolean; isNewUser: boolean; user?: any; message?: string }> => {
  await delay(800);
  
  console.log('[MockAuth] Verifying OTP:', otp, 'for:', phoneNumber);
  
  if (otp !== MOCK_OTP) {
    return {
      success: false,
      isNewUser: false,
      message: 'Invalid OTP. Use 123456 for testing.',
    };
  }
  
  const formattedPhone = phoneNumber.startsWith('+220') ? phoneNumber : `+220${phoneNumber}`;
  const existingUser = MOCK_USERS[formattedPhone as keyof typeof MOCK_USERS];
  
  if (existingUser) {
    return {
      success: true,
      isNewUser: false,
      user: existingUser,
    };
  }
  
  return {
    success: true,
    isNewUser: true,
  };
};

/**
 * Mock login with password
 * In real app: calls /api/auth/login
 */
export const mockLogin = async (
  phoneNumber: string,
  password: string
): Promise<{ success: boolean; user?: any; message?: string }> => {
  await delay(1000);
  
  console.log('[MockAuth] Login attempt:', phoneNumber);
  
  const formattedPhone = phoneNumber.startsWith('+220') ? phoneNumber : `+220${phoneNumber}`;
  const user = MOCK_USERS[formattedPhone as keyof typeof MOCK_USERS];
  
  if (!user) {
    return {
      success: false,
      message: 'User not found. Try +2207123456',
    };
  }
  
  if (user.password !== password) {
    return {
      success: false,
      message: 'Invalid password. Use: test1234',
    };
  }
  
  return {
    success: true,
    user,
  };
};

/**
 * Mock register new user
 * In real app: calls /api/auth/register
 */
export const mockRegister = async (userData: {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: any; message?: string }> => {
  await delay(1200);
  
  console.log('[MockAuth] Registering user:', userData);
  
  // Simulate successful registration
  const newUser = {
    id: Date.now(),
    ...userData,
    isVerified: true,
    registrationComplete: false,
    currentStep: 'personal',
  };
  
  return {
    success: true,
    user: newUser,
  };
};

/**
 * Mock complete profile step
 * In real app: calls /api/citizen/{id}/complete-profile
 */
export const mockCompleteProfileStep = async (
  userId: number,
  step: 'personal' | 'profile' | 'address',
  data: any
): Promise<{ success: boolean; nextStep?: string; message?: string }> => {
  await delay(800);
  
  console.log('[MockAuth] Completing step:', step, 'for user:', userId, 'data:', data);
  
  const nextSteps: Record<string, string | null> = {
    personal: 'profile',
    profile: 'address',
    address: null, // Registration complete
  };
  
  return {
    success: true,
    nextStep: nextSteps[step] || undefined,
    message: nextSteps[step] ? `Proceed to ${nextSteps[step]} step` : 'Registration complete!',
  };
};

/**
 * Get mock tokens (for Redux store)
 */
export const getMockTokens = () => ({
  accessToken: 'mock_access_token_' + Date.now(),
  refreshToken: 'mock_refresh_token_' + Date.now(),
  expiresIn: 3600,
});

/**
 * Test credentials for display
 */
export const TEST_CREDENTIALS = {
  existingUser: {
    phone: '7123456',
    password: 'test1234',
    otp: '123456',
  },
  incompleteUser: {
    phone: '7654321',
    password: 'test1234',
    otp: '123456',
  },
};

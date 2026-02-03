import { db } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore/lite';

// Generate a unique referral code
// Uses characters that are easy to read (no 0/O, 1/I/L confusion)
export const generateReferralCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'REF-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Check if a referral code already exists
export const codeExists = async (code) => {
  const q = query(collection(db, 'referrers'), where('code', '==', code));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Generate a unique code that doesn't exist in the database
export const generateUniqueCode = async () => {
  let code = generateReferralCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (await codeExists(code) && attempts < maxAttempts) {
    code = generateReferralCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    // Add timestamp to ensure uniqueness
    code = `REF-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  }

  return code;
};

// Register a new referrer and generate their code
export const registerReferrer = async (name, email, phone) => {
  try {
    // Check if email already exists
    const q = query(collection(db, 'referrers'), where('email', '==', email.toLowerCase()));
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      // Return existing referrer data
      const existingDoc = existingSnapshot.docs[0];
      return {
        success: true,
        isExisting: true,
        data: { id: existingDoc.id, ...existingDoc.data() }
      };
    }

    // Generate unique code
    const code = await generateUniqueCode();

    // Create referrer document
    const referrerData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      code,
      createdAt: serverTimestamp(),
      referralCount: 0,
      earnings: 0,
      status: 'active'
    };

    const docRef = doc(collection(db, 'referrers'));
    await setDoc(docRef, referrerData);

    return {
      success: true,
      isExisting: false,
      data: { id: docRef.id, ...referrerData }
    };
  } catch (error) {
    console.error('Error registering referrer:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Validate a referral code
export const validateReferralCode = async (code) => {
  try {
    const normalizedCode = code.toUpperCase().trim();
    const q = query(collection(db, 'referrers'), where('code', '==', normalizedCode));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { valid: false, error: 'Invalid referral code' };
    }

    const referrerDoc = snapshot.docs[0];
    const referrerData = referrerDoc.data();

    return {
      valid: true,
      referrer: {
        id: referrerDoc.id,
        name: referrerData.name,
        code: referrerData.code
      }
    };
  } catch (error) {
    console.error('Error validating code:', error);
    return { valid: false, error: error.message };
  }
};

// Use a referral code (when friend signs up)
export const useReferralCode = async (code, friendName, friendEmail, friendPhone) => {
  try {
    // Validate the code first
    const validation = await validateReferralCode(code);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check if this email has already used a referral code
    const existingReferralQuery = query(
      collection(db, 'referrals'),
      where('friendEmail', '==', friendEmail.toLowerCase())
    );
    const existingSnapshot = await getDocs(existingReferralQuery);

    if (!existingSnapshot.empty) {
      return { success: false, error: 'This email has already used a referral code' };
    }

    // Create referral record
    const referralData = {
      referrerCode: code.toUpperCase(),
      referrerId: validation.referrer.id,
      referrerName: validation.referrer.name,
      friendName: friendName.trim(),
      friendEmail: friendEmail.toLowerCase().trim(),
      friendPhone: friendPhone?.trim() || '',
      usedAt: serverTimestamp(),
      status: 'pending', // pending, verified, paid
      referrerReward: 50,
      friendReward: 50
    };

    const referralRef = doc(collection(db, 'referrals'));
    await setDoc(referralRef, referralData);

    // Update referrer's stats
    const referrerRef = doc(db, 'referrers', validation.referrer.id);
    await updateDoc(referrerRef, {
      referralCount: increment(1)
    });

    return {
      success: true,
      data: {
        referralId: referralRef.id,
        referrerName: validation.referrer.name,
        rewards: {
          referrer: 50,
          friend: 50
        }
      }
    };
  } catch (error) {
    console.error('Error using referral code:', error);
    return { success: false, error: error.message };
  }
};

// Get referrer stats by email
export const getReferrerStats = async (email) => {
  try {
    const q = query(collection(db, 'referrers'), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { found: false };
    }

    const referrerDoc = snapshot.docs[0];
    const referrerData = referrerDoc.data();

    // Get all referrals for this referrer
    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerId', '==', referrerDoc.id)
    );
    const referralsSnapshot = await getDocs(referralsQuery);

    const referrals = referralsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      found: true,
      data: {
        ...referrerData,
        id: referrerDoc.id,
        referrals
      }
    };
  } catch (error) {
    console.error('Error getting referrer stats:', error);
    return { found: false, error: error.message };
  }
};

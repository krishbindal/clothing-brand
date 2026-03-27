'use client'

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getFirebaseApp } from './client'
import type { Address } from '@/types'

let cachedDb: ReturnType<typeof getFirestore> | null = null

function getDb() {
  if (cachedDb) return cachedDb
  try {
    const app = getFirebaseApp()
    cachedDb = getFirestore(app)
    return cachedDb
  } catch (error) {
    console.warn('Firestore unavailable', error)
    return null
  }
}

export async function fetchAddresses(userId: string): Promise<Address[]> {
  const db = getDb()
  if (!db) return []

  const snap = await getDocs(collection(db, 'users', userId, 'addresses'))
  return snap.docs.map((snapshot) => {
    const data = snapshot.data() as Address
    return { ...data, id: snapshot.id }
  })
}

export async function createAddress(userId: string, address: Address) {
  const db = getDb()
  if (!db) return null
  const ref = await addDoc(collection(db, 'users', userId, 'addresses'), {
    ...address,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateAddress(userId: string, addressId: string, address: Address) {
  const db = getDb()
  if (!db) return null
  const ref = doc(db, 'users', userId, 'addresses', addressId)
  await updateDoc(ref, { ...address, updatedAt: serverTimestamp() })
  return addressId
}

export async function deleteAddress(userId: string, addressId: string) {
  const db = getDb()
  if (!db) return
  const ref = doc(db, 'users', userId, 'addresses', addressId)
  await deleteDoc(ref)
}

export async function setDefaultAddress(userId: string, addressId: string) {
  const db = getDb()
  if (!db) return
  const addressesRef = collection(db, 'users', userId, 'addresses')
  const snap = await getDocs(addressesRef)
  const updates = snap.docs.map((snapshot) => {
    const ref = doc(db, 'users', userId, 'addresses', snapshot.id)
    const isDefault = snapshot.id === addressId
    return updateDoc(ref, { isDefault, updatedAt: serverTimestamp() })
  })
  await Promise.all(updates)
}

export type ProfilePayload = {
  name?: string
  email?: string
  phone?: string
  photoURL?: string | null
}

export async function fetchProfile(userId: string): Promise<ProfilePayload | null> {
  const db = getDb()
  if (!db) return null
  const ref = doc(db, 'profiles', userId)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) return null
  return snapshot.data() as ProfilePayload
}

export async function saveProfile(userId: string, payload: ProfilePayload) {
  const db = getDb()
  if (!db) return null
  const ref = doc(db, 'profiles', userId)
  await setDoc(
    ref,
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
  return true
}

export async function joinWaitlist(email: string, name?: string | null) {
  const db = getDb()
  if (!db) return null
  await addDoc(collection(db, 'waitlist'), {
    email,
    name: name || null,
    createdAt: serverTimestamp(),
  })
  return true
}

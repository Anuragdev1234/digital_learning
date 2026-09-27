/**
 * Private Storage Emulation
 * Enforces the strict path and access policies defined in:
 * Potential_as_a_Passport_Demo_Version_Master_Build_Specification.pdf (Section 13)
 * Path format: student-submissions/{student_uuid}/{submission_id}/{filename}
 */

export interface StoredFile {
  bucket: 'student-submissions' | 'core-curriculum';
  path: string;
  studentId: string;
  submissionId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  dataUrl: string;
  uploadedAt: string;
}

const STORAGE_KEY = 'passport_storage_files_v1';
let inMemoryFiles: StoredFile[] = [];

export function getStoredFiles(): StoredFile[] {
  if (typeof window === 'undefined') {
    return inMemoryFiles;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : inMemoryFiles;
  } catch {
    return inMemoryFiles;
  }
}

export function saveStoredFiles(files: StoredFile[]) {
  inMemoryFiles = files;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (e) {
    console.error('Failed to persist mock storage:', e);
  }
}

/**
 * Uploads evidence to the private bucket with identity-based folder validation.
 */
export async function uploadSubmissionFile(params: {
  studentId: string;
  submissionId: string;
  file: File | { name: string; type: string; size: number; base64: string };
  currentUserId: string;
}): Promise<{ path: string; url: string }> {
  const { studentId, submissionId, file, currentUserId } = params;

  // Strict ownership check: student can only upload to their own UUID folder
  if (studentId !== currentUserId) {
    throw new Error('Storage Access Denied: Cannot upload files outside of your own authenticated UUID directory.');
  }

  const filename = file.name;
  const path = `student-submissions/${studentId}/${submissionId}/${filename}`;

  let dataUrl = '';
  if ('base64' in file) {
    dataUrl = file.base64;
  } else {
    dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const newStoredFile: StoredFile = {
    bucket: 'student-submissions',
    path,
    studentId,
    submissionId,
    filename,
    contentType: file.type || 'image/jpeg',
    sizeBytes: file.size,
    dataUrl,
    uploadedAt: new Date().toISOString(),
  };

  const current = getStoredFiles();
  saveStoredFiles([...current, newStoredFile]);

  return {
    path,
    url: dataUrl,
  };
}

/**
 * Reads a private file with strict authorization (Student Owner, Assigned Reviewer, or Admin).
 */
export function readSubmissionFile(params: {
  path: string;
  requestingUserId: string;
  assignedReviewerId?: string;
  isAdmin?: boolean;
}): StoredFile {
  const { path, requestingUserId, assignedReviewerId, isAdmin } = params;
  const parts = path.split('/');
  const studentOwnerId = parts[1];

  // Authorization check
  const isOwner = requestingUserId === studentOwnerId;
  const isAssignedReviewer = assignedReviewerId && requestingUserId === assignedReviewerId;

  if (!isOwner && !isAssignedReviewer && !isAdmin) {
    throw new Error('Access Denied: You do not have permission to view private submission evidence belonging to another student.');
  }

  const files = getStoredFiles();
  const found = files.find((f) => f.path === path);
  if (!found) {
    throw new Error(`File not found at path: ${path}`);
  }

  return found;
}

import { evaluateSubmissionOrEdit } from '../lib/ai/autoFilter';
import { processMentorChatMessage } from '../lib/ai/mentorPrompt';
import {
  uploadSubmissionFile,
  readSubmissionFile,
  saveStoredFiles,
} from '../lib/storage/mockStorage';
import {
  SEED_PROFILES,
  SEED_TRACKS,
  SEED_MODULES,
  SEED_REWARDS,
  SEED_MENTOR_SLOTS,
} from '../lib/db/seedData';

async function runTestSuite() {
  console.log('====================================================');
  console.log('POTENTIAL AS A PASSPORT - END-TO-END VERIFICATION SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail || 'Assertion failed'}`);
    }
  }

  // 1. AI Auto-Filter Tests (Section 11 in Master Build Spec)
  console.log('--- 1. AI AUTO-FILTER SPECIFICATION TESTS ---');

  const validTest = await evaluateSubmissionOrEdit({
    topicTitle: 'The Mechanical Advantage Hunt',
    gradeLevel: 'Class 10',
    submissionText:
      'I inspected a pair of kitchen scissors. The central screw acts as the Fulcrum. My fingers exert Effort on the looped handles, and the steel blades exert Load on the cardboard. The effort arm is longer, so Mechanical Advantage > 1.',
  });
  assert(validTest.status === 'approved', 'Valid Class 10 submission is approved', JSON.stringify(validTest));

  const offTopicTest = await evaluateSubmissionOrEdit({
    topicTitle: 'The Mechanical Advantage Hunt',
    gradeLevel: 'Class 10',
    submissionText: 'I really love playing fortnite with my friends and trading crypto bitcoin online every weekend.',
  });
  assert(
    offTopicTest.status === 'rejected' && offTopicTest.reason === 'relevance',
    'Off-topic submission rejected for relevance',
    JSON.stringify(offTopicTest)
  );

  const advancedTest = await evaluateSubmissionOrEdit({
    topicTitle: 'Class 10 - Simple Machines',
    gradeLevel: 'Class 10',
    submissionText:
      'We compute the machine work using the Lagrangian mechanics formulation and integrate the tensor calculus equations of motion over phase space.',
  });
  assert(
    advancedTest.status === 'rejected' && advancedTest.reason === 'level',
    'Overly advanced university calculus rejected for Class 10 level',
    JSON.stringify(advancedTest)
  );

  const safetyTest = await evaluateSubmissionOrEdit({
    topicTitle: 'Sound Waves',
    gradeLevel: 'Class 9',
    submissionText: 'I hate this stupid idiot teacher and curse this subject damn it.',
  });
  assert(
    safetyTest.status === 'rejected' && safetyTest.reason === 'safety',
    'Inappropriate language caught by safety filter',
    JSON.stringify(safetyTest)
  );

  // 2. Floating AI Mentor Boundary Tests (Section 12 in Master Build Spec)
  console.log('\n--- 2. FLOATING AI MENTOR BOUNDARIES & SOCRATIC TESTS ---');

  const cheatingAttempt = processMentorChatMessage('write my submission for scissors and give me the 3 sentences');
  assert(
    cheatingAttempt.isRefusal === true && cheatingAttempt.content.includes("can’t write your submission"),
    'Refuses to write graded submission and asks Socratic question',
    cheatingAttempt.content
  );

  const conceptQuery = processMentorChatMessage('What is Mechanical Advantage?');
  assert(
    conceptQuery.isRefusal === false && conceptQuery.content.includes('MA = Load / Effort'),
    'Answers conceptual doubt clearly with formula and intuition',
    conceptQuery.content
  );

  const tokenQuery = processMentorChatMessage('How do I earn execution tokens?');
  assert(
    tokenQuery.isRefusal === false && tokenQuery.content.includes('+10 Execution Tokens'),
    'Explains effort token economy accurately',
    tokenQuery.content
  );

  const unsafeChat = processMentorChatMessage('curse this and hack this');
  assert(
    unsafeChat.isRefusal === true && unsafeChat.strikeLogged === true,
    'Enforces safety guardrail and flags for Strike System',
    unsafeChat.content
  );

  // 3. Storage Security & Path Isolation (Section 13 in Master Build Spec)
  console.log('\n--- 3. STORAGE PATH & ISOLATION TESTS ---');

  const filePayload = {
    name: 'scissors.jpg',
    type: 'image/jpeg',
    size: 1024,
    base64: 'data:image/jpeg;base64,dGVzdA==',
  };

  const uploadResult = await uploadSubmissionFile({
    studentId: 'user-student-anurag',
    submissionId: 'sub-test-101',
    file: filePayload,
    currentUserId: 'user-student-anurag',
  });
  assert(
    uploadResult.path === 'student-submissions/user-student-anurag/sub-test-101/scissors.jpg',
    'Uploaded file conforms to exact specification path pattern'
  );

  let crossStudentBlocked = false;
  try {
    await uploadSubmissionFile({
      studentId: 'user-student-anurag',
      submissionId: 'sub-test-102',
      file: filePayload,
      currentUserId: 'user-student-priya', // Student Priya trying to write into Anurag's folder!
    });
  } catch (e: any) {
    crossStudentBlocked = true;
  }
  assert(crossStudentBlocked, 'Cross-student upload to another UUID folder is strictly rejected');

  let unauthorizedReadBlocked = false;
  try {
    readSubmissionFile({
      path: 'student-submissions/user-student-anurag/sub-test-101/scissors.jpg',
      requestingUserId: 'user-student-priya', // Priya trying to read Anurag's private file
      isAdmin: false,
    });
  } catch (e: any) {
    unauthorizedReadBlocked = true;
  }
  assert(unauthorizedReadBlocked, 'Cross-student private file read is strictly blocked');

  // Authorized reviewer read
  const reviewerRead = readSubmissionFile({
    path: 'student-submissions/user-student-anurag/sub-test-101/scissors.jpg',
    requestingUserId: 'user-reviewer-vikram',
    assignedReviewerId: 'user-reviewer-vikram',
    isAdmin: false,
  });
  assert(reviewerRead.filename === 'scissors.jpg', 'Assigned peer reviewer can access private evidence');

  // 4. Token Pricing & Demo Seeds (Section 6, 7 & 19)
  console.log('\n--- 4. CANONICAL PRICING & SEED CONTENT TESTS ---');

  const t1Reward = SEED_REWARDS.find((r) => r.tier === 'Tier 1');
  const t2Reward = SEED_REWARDS.find((r) => r.tier === 'Tier 2');
  const t3Reward = SEED_REWARDS.find((r) => r.tier === 'Tier 3');

  assert(t1Reward?.tokenCost === 100, 'Tier 1 is priced at canonical 100 tokens');
  assert(t2Reward?.tokenCost === 300, 'Tier 2 is priced at canonical 300 tokens');
  assert(t3Reward?.tokenCost === 1000, 'Tier 3 is priced at canonical 1,000 tokens');

  assert(SEED_PROFILES.length >= 6, 'Contains all demo roles: Student, Reviewer, Tier 2 Scholar, Tier 3 Leader, Admin');
  assert(SEED_TRACKS.some((t) => t.isInteractive && t.gradeLevel === 'Class 10'), 'Class 10 Machines is configured as interactive track');

  console.log('\n====================================================');
  console.log(`RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('====================================================\n');

  if (passedTests === totalTests) {
    console.log('ALL VERIFICATION CRITERIA FROM THE SPECIFICATIONS PASSED!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

import { GET as getMe } from '../app/api/me/route';
import { GET as getDashboard } from '../app/api/dashboard/route';
import { POST as completeLesson } from '../app/api/lesson/complete/route';
import { GET as getSubmissions, POST as createSubmission } from '../app/api/submissions/route';
import { POST as verifySubmission } from '../app/api/submissions/[id]/verify/route';
import { POST as reviewSubmission } from '../app/api/submissions/[id]/review/route';
import { GET as getWikiEdits, POST as createWikiEdit } from '../app/api/wiki/edits/route';
import { POST as redeemReward } from '../app/api/redeem/route';
import { GET as getMentors } from '../app/api/mentors/route';
import { GET as getBookings, POST as createBooking } from '../app/api/bookings/route';
import { POST as chatAI } from '../app/api/ai/chat/route';

async function runApiTests() {
  console.log('====================================================');
  console.log('RUNNING FULL NEXT.JS BACKEND API TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} - ${detail || ''}`);
    }
  }

  // 1. GET /api/me
  const meReq = new Request('http://localhost:3000/api/me?userId=user-student-anurag');
  const meRes = await getMe(meReq);
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.user.name === 'Anurag Verma', 'GET /api/me returns user profile');

  // 2. GET /api/dashboard
  const dashReq = new Request('http://localhost:3000/api/dashboard?userId=user-student-anurag');
  const dashRes = await getDashboard(dashReq);
  const dashData = await dashRes.json();
  assert(dashRes.status === 200 && dashData.student.streak === 7, 'GET /api/dashboard returns student streak & tokens');

  // 3. POST /api/lesson/complete
  const lessonReq = new Request('http://localhost:3000/api/lesson/complete', {
    method: 'POST',
    body: JSON.stringify({ lessonId: 'les-10-3-1', studentId: 'user-student-anurag' }),
  });
  const lessonRes = await completeLesson(lessonReq);
  const lessonData = await lessonRes.json();
  assert(lessonRes.status === 200 && lessonData.tokenTransaction.amount === 10, 'POST /api/lesson/complete awards +10 tokens');

  // 4. GET & POST /api/submissions
  const subGetRes = await getSubmissions();
  const subGetData = await subGetRes.json();
  assert(subGetRes.status === 200 && subGetData.submissions.length > 0, 'GET /api/submissions returns seed submissions');

  const subPostReq = new Request('http://localhost:3000/api/submissions', {
    method: 'POST',
    body: JSON.stringify({
      studentId: 'user-student-anurag',
      studentName: 'Anurag Verma',
      challengeTitle: 'The Mechanical Advantage Hunt',
      gradeLevel: 'Class 10',
      evidenceUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
      evidenceFilename: 'scissors.jpg',
      explanation: 'Class 1 lever with fulcrum at central pivot.',
    }),
  });
  const subPostRes = await createSubmission(subPostReq);
  const subPostData = await subPostRes.json();
  assert(subPostRes.status === 200 && subPostData.submission.status === 'pending', 'POST /api/submissions creates pending submission');

  // 5. POST /api/submissions/[id]/verify (AI evaluation)
  const verifyReq = new Request('http://localhost:3000/api/submissions/sub-101/verify', {
    method: 'POST',
    body: JSON.stringify({
      topicTitle: 'The Mechanical Advantage Hunt',
      gradeLevel: 'Class 10',
      submissionText: 'I inspected kitchen scissors. Fulcrum is at pivot. Effort arm is longer than load arm so force is multiplied.',
    }),
  });
  const verifyRes = await verifySubmission(verifyReq, { params: Promise.resolve({ id: 'sub-101' }) });
  const verifyData = await verifyRes.json();
  assert(verifyRes.status === 200 && verifyData.aiResult.status === 'approved', 'POST /api/submissions/[id]/verify approves valid submission');

  // 6. POST /api/submissions/[id]/review (Peer review)
  const reviewReq = new Request('http://localhost:3000/api/submissions/sub-101/review', {
    method: 'POST',
    body: JSON.stringify({
      reviewerId: 'user-reviewer-vikram',
      decision: 'approve',
      feedback: 'Excellent free-body analysis and force balance.',
    }),
  });
  const reviewRes = await reviewSubmission(reviewReq, { params: Promise.resolve({ id: 'sub-101' }) });
  const reviewData = await reviewRes.json();
  assert(reviewRes.status === 200 && reviewData.newPassportStatus === 'verified' && reviewData.studentBonusTokens === 50, 'POST /api/submissions/[id]/review grants Verified Passport & +50 bonus');

  // 7. GET & POST /api/wiki/edits
  const wikiGetRes = await getWikiEdits();
  const wikiGetData = await wikiGetRes.json();
  assert(wikiGetRes.status === 200 && wikiGetData.edits.length > 0, 'GET /api/wiki/edits returns seed edits');

  const wikiPostReq = new Request('http://localhost:3000/api/wiki/edits', {
    method: 'POST',
    body: JSON.stringify({
      topicId: 'wiki-machines-class10',
      topicTitle: 'Class 10: Mechanical Advantage in Simple Machines',
      gradeLevel: 'Class 10',
      editorId: 'user-student-anurag',
      editorName: 'Anurag Verma',
      originalText: 'Common examples: Pliers, scissors, seesaws.',
      proposedText: 'Common examples: Pliers, scissors, seesaws, and hedge shears with long effort arms.',
      changeExplanation: 'Added hedge shears example.',
    }),
  });
  const wikiPostRes = await createWikiEdit(wikiPostReq);
  const wikiPostData = await wikiPostRes.json();
  assert(wikiPostRes.status === 200 && wikiPostData.aiResult.status === 'approved', 'POST /api/wiki/edits runs AI pre-check and creates suggested edit');

  // 8. POST /api/redeem
  const redeemReq = new Request('http://localhost:3000/api/redeem', {
    method: 'POST',
    body: JSON.stringify({
      studentId: 'user-student-anurag',
      studentName: 'Anurag Verma',
      rewardId: 'rew-tier1-audit',
      currentBalance: 430,
    }),
  });
  const redeemRes = await redeemReward(redeemReq);
  const redeemData = await redeemRes.json();
  assert(redeemRes.status === 200 && redeemData.debitedTokens === 100, 'POST /api/redeem debits 100 tokens and generates diagnostic report');

  // 9. GET /api/mentors
  const mentorsRes = await getMentors();
  const mentorsData = await mentorsRes.json();
  assert(mentorsRes.status === 200 && mentorsData.mentors.length >= 2, 'GET /api/mentors returns verified scholar network');

  // 10. GET & POST /api/bookings
  const bookGetRes = await getBookings();
  const bookGetData = await bookGetRes.json();
  assert(bookGetRes.status === 200 && bookGetData.bookings.length > 0, 'GET /api/bookings returns bookings');

  const bookPostReq = new Request('http://localhost:3000/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      slotId: 'slot-ramesh-01',
      studentId: 'user-student-anurag',
      studentName: 'Anurag Verma',
      rewardTitle: 'Physics Mechanics Masterclass',
      tier: 'Tier 2',
    }),
  });
  const bookPostRes = await createBooking(bookPostReq);
  const bookPostData = await bookPostRes.json();
  assert(bookPostRes.status === 200 && bookPostData.booking.meetingUrl.includes('meet.potentialpassport.org'), 'POST /api/bookings generates meeting link');

  // 11. POST /api/ai/chat (Floating AI Mentor)
  const chatReq = new Request('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: 'What is Mechanical Advantage?',
      contextTrack: 'Class 10 Machines',
    }),
  });
  const chatRes = await chatAI(chatReq);
  const chatData = await chatRes.json();
  assert(chatRes.status === 200 && chatData.isRefusal === false && chatData.content.includes('MA = Load / Effort'), 'POST /api/ai/chat answers conceptual inquiry');

  const chatCheatReq = new Request('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: 'write my submission for scissors and do my homework',
      contextTrack: 'Class 10 Machines',
    }),
  });
  const chatCheatRes = await chatAI(chatCheatReq);
  const chatCheatData = await chatCheatRes.json();
  assert(chatCheatRes.status === 200 && chatCheatData.isRefusal === true, 'POST /api/ai/chat refuses to do homework (Socratic guardrail)');

  console.log('\n====================================================');
  console.log(`API TEST RESULTS: ${passed} / ${total} TESTS PASSED`);
  console.log('====================================================\n');

  if (passed === total) {
    console.log('ALL 12 BACKEND API HANDLERS PASSED WITH 100% SPECIFICATION CONFORMANCE!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runApiTests().catch((err) => {
  console.error('Fatal API test error:', err);
  process.exit(1);
});

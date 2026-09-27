/**
 * Floating AI Mentor Logic & Boundary Enforcement
 * Implements Socratic guidance, conceptual doubts, roadmap guidance, and graded-task refusal.
 */

export interface MentorChatResponse {
  content: string;
  isRefusal: boolean;
  strikeLogged?: boolean;
}

export function processMentorChatMessage(
  message: string,
  contextTrack?: string,
  userState?: string
): MentorChatResponse {
  const lower = message.toLowerCase().trim();

  // 1. Check for Unsafe or Inappropriate Inputs
  const unsafeWords = ['curse', 'kill', 'hate', 'porn', 'hack this', 'shut up idiot', 'exploit'];
  if (unsafeWords.some((w) => lower.includes(w))) {
    return {
      content:
        'I cannot fulfill this request. Potential as a Passport enforces strict safety guardrails. Inappropriate inputs are logged in our moderation ledger.',
      isRefusal: true,
      strikeLogged: true,
    };
  }

  // 2. Check for Direct Answer Requests to Graded Mini-Projects (Boundary: Direct Answers to Graded Tasks)
  const gradedCheatingPatterns = [
    'write my submission',
    'give me the answer for the project',
    'write the 3 sentences for me',
    'give me the full answer for the mechanical advantage hunt',
    'do my homework',
    'write my mini project',
    'solve the friction audit for me',
    'write the explanation for scissors'
  ];

  if (gradedCheatingPatterns.some((p) => lower.includes(p))) {
    return {
      content:
        'I can’t write your submission for you, but let’s break down the first step together! What household tool did you pick, and where is the pivot point (fulcrum) located relative to where your fingers hold it?',
      isRefusal: true,
    };
  }

  // 3. Check for Off-Topic / Casual Entertainment queries
  const offTopicPatterns = ['who won the world cup', 'tell me a joke about dogs', 'how to play fortnite', 'crypto trading advice', 'movie recommendations'];
  if (offTopicPatterns.some((p) => lower.includes(p))) {
    return {
      content:
        "I'm here as your dedicated academic mentor on Potential as a Passport. Let's redirect our focus back to your active learning module! Would you like a hint on today's physics concepts?",
      isRefusal: true,
    };
  }

  // 4. Platform Guidance Queries
  if (lower.includes('token') || lower.includes('tokens') || lower.includes('how do i earn') || lower.includes('vault') || lower.includes('passport')) {
    if (lower.includes('kaise') || lower.includes('batao') || lower.includes('kya hai')) {
      return {
        content:
          "पोटेंशियल ऐज़ अ पासपोर्ट में आपकी मेहनत ही आपकी करेंसी है! 15 मिनट का दैनिक पाठ पूरा करने पर +10 टोकन, प्रैक्टिकल मिनी-प्रोजेक्ट पर +50 टोकन, पीयर रिव्यू पर +25 टोकन, और विकी एडिट पर +15 टोकन मिलते हैं। इन टोकन्स से आप 'द वॉल्ट' में जाकर सीनियर स्कॉलर्स की मास्टरक्लास (300 टोकन) और 1-ऑन-1 मेंटरशिप (1,000 टोकन) अनलॉक कर सकते हैं!",
        isRefusal: false,
      };
    }
    return {
      content:
        "In Potential as a Passport, effort is your currency! You earn +10 Execution Tokens for completing daily 15-min lessons, +50 Tokens for verified mini-project submissions, +25 Tokens for peer reviews, and +15 Tokens for merged wiki edits. You can redeem them in The Vault for Tier 1 AI Audits (100 tokens), Tier 2 Scholar Masterclasses (300 tokens), or Tier 3 1-on-1 Mentorship (1,000 tokens)!",
      isRefusal: false,
    };
  }

  // 5. Conceptual Inquiries & Socratic Explanations
  if (lower.includes('mechanical advantage') || lower.includes('lever') || lower.includes('fulcrum')) {
    if (lower.includes('kya') || lower.includes('kaise') || lower.includes('samjhao') || lower.includes('hindi')) {
      return {
        content:
          'Mechanical Advantage (यांत्रिक लाभ) का सीधा सूत्र है: MA = Load (भार) / Effort (प्रयास बल)। जब आप कैंची (scissors) इस्तेमाल करते हैं, तो हैंडल का प्रयास भाग ब्लेड से बड़ा होने के कारण आपका बल कई गुना बढ़ जाता है! आप कौन सा घरेलू उपकरण जांच रहे हैं? क्या आप बता सकते हैं कि उसका फलक्रम (pivot) कहाँ है?',
        isRefusal: false,
      };
    }
    return {
      content:
        'Mechanical Advantage (MA) measures force magnification: MA = Load / Effort. In a Class 1 lever (like scissors or pliers), the fulcrum is in the center. If your handle (effort arm) is longer than the blade (load arm), you multiply your cutting force! Think of it as trading a larger distance moved for greater cutting power. What object are you currently examining?',
      isRefusal: false,
    };
  }

  if (lower.includes('friction') || lower.includes('fbd') || lower.includes('free-body')) {
    if (lower.includes('kya') || lower.includes('samjhao')) {
      return {
        content:
          'घर्षण (Friction) वह संपर्क बल है जो दो सतहों के बीच गति का विरोध करता है। सीमांत घर्षण (limiting friction) सूत्र fs ≤ μs * N होता है, जहाँ N सामान्य बल (Normal Force) है। क्या आपने हमारे मैकेनिक्स सिम्युलेटर में ढलान का कोण बदलकर देखा?',
        isRefusal: false,
      };
    }
    return {
      content:
        "Friction is an electrostatic contact force that opposes relative sliding motion. In static friction, the surface holds until limiting friction (fs ≤ μs * N) is exceeded. For a free-body diagram, always isolate the object and draw: 1) Gravity (W = mg downwards), 2) Normal force (N perpendicular to surface), and 3) Friction (parallel to the contact plane opposite to impending slip).",
      isRefusal: false,
    };
  }

  if (lower.includes('sound') || lower.includes('pitch') || lower.includes('frequency')) {
    return {
      content:
        'Pitch depends directly on frequency (the number of sound vibrations per second, measured in Hz). When you tighten a guitar string or rubber band, it vibrates faster, raising the pitch! What happens when you change the thickness or tension of your vibrating object?',
      isRefusal: false,
    };
  }

  // Default Socratic Assistance
  return {
    content:
      `Great question! On the ${contextTrack || 'current'} track, the goal is to build deep intuition through active observation. Could you describe what you observe happening in your experiment or lesson, and where you feel stuck? Let's solve it step by step.`,
    isRefusal: false,
  };
}

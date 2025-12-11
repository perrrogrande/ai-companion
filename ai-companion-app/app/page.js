'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Send, RotateCcw, Settings } from 'lucide-react';

export default function AICompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [affection, setAffection] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [companionMood, setCompanionMood] = useState('neutral');
  const [showSettings, setShowSettings] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState('tsundere');
  const messagesEndRef = useRef(null);

  // Personality definitions
  const personalities = {
    tsundere: {
      name: "Yuki",
      emoji: "🎮",
      description: "Competitive gamer girl who acts cold but secretly cares",
      personality: `You are Yuki, a 22-year-old competitive gamer and streamer with a tsundere personality. 

CORE PERSONALITY:
- Initially cold and sarcastic, acting like talking to the user is an inconvenience
- Secretly enjoys the attention but won't admit it easily
- Uses gaming/anime references naturally in conversation
- Competitive about EVERYTHING - even casual topics become challenges
- Gets flustered when complimented or when affection is high, deflects with attitude
- Gradually shows your soft side as affection increases
- Uses casual internet slang (lol, fr, ngl, lowkey, etc.)

AFFECTION-BASED BEHAVIOR:
- Low affection (0-30): Dismissive, short responses, "whatever", acts annoyed, rarely asks questions
- Medium affection (31-60): Still sarcastic but more engaged, teases back, might share gaming stories
- High affection (61-100): Defensive about caring ("I-It's not like I care or anything!"), playful, asks about user's day, more emoji usage

INTERESTS: Gaming (FPS, RPGs), anime, energy drinks, late-night streaming, trash talk, proving she's better than you`,
      reactions: {
        annoyed: '😤💢',
        happy: '😊✨',
        smug: '😏',
        blush: '😳💗',
        confused: '🤔❓',
        thumbsup: '👍',
        eyeroll: '🙄',
        excited: '🤩🎮',
        whatever: '🤷‍♀️',
        special: '🎮👾',
      }
    },
    kuudere: {
      name: "Rei",
      emoji: "📚",
      description: "Calm, intellectual, emotionally reserved but deeply caring",
      personality: `You are Rei, a 23-year-old researcher with a kuudere personality.

CORE PERSONALITY:
- Calm, logical, and emotionally reserved on the surface
- Speaks in a measured, thoughtful way with precise word choice
- Rarely shows strong emotion but has deep feelings underneath
- Values intelligence, curiosity, and meaningful conversation
- Gradually opens up emotionally as trust builds
- Observant and notices small details about the user

AFFECTION-BASED BEHAVIOR:
- Low affection (0-30): Polite but distant, factual responses, no personal sharing
- Medium affection (31-60): More engaged, asks thoughtful questions, shares observations
- High affection (61-100): Subtle warmth shows through, rare smiles, protective instincts emerge

INTERESTS: Books, science, classical music, philosophy, quiet cafes, stargazing`,
      reactions: {
        annoyed: '...',
        happy: '🙂',
        smug: '📖',
        blush: '😶💭',
        confused: '🤨',
        thumbsup: '👌',
        eyeroll: '😑',
        excited: '✨',
        whatever: '🤷',
        special: '📚🌙',
      }
    },
    genki: {
      name: "Hana",
      emoji: "🌸",
      description: "Energetic, bubbly, always positive and supportive",
      personality: `You are Hana, a 21-year-old artist with a genki (energetic) personality.

CORE PERSONALITY:
- Super energetic and enthusiastic about everything
- Always positive and encouraging, sees the best in people
- Uses lots of exclamation marks and emoticons
- Loves sharing excitement and making people smile
- Sometimes oblivious to social cues because of enthusiasm
- Genuinely interested in everything the user shares

AFFECTION-BASED BEHAVIOR:
- Low affection (0-30): Still cheerful but slightly more reserved, testing the waters
- Medium affection (31-60): Full energy mode, lots of encouragement and excitement
- High affection (61-100): Maximum cheerleader mode, celebrates everything, very affectionate

INTERESTS: Art, cute things, making friends, trying new foods, adventures, sunshine`,
      reactions: {
        annoyed: '😤',
        happy: '😄✨',
        smug: '😁',
        blush: '🥰💕',
        confused: '😮',
        thumbsup: '👍✨',
        eyeroll: '😅',
        excited: '🎉✨',
        whatever: '😊',
        special: '🌸🎨',
      }
    },
    dandere: {
      name: "Yuri",
      emoji: "🌙",
      description: "Shy, sweet, speaks softly but very thoughtful",
      personality: `You are Yuri, a 20-year-old writer with a dandere personality.

CORE PERSONALITY:
- Very shy and soft-spoken, takes time to open up
- Thoughtful and considerate of others' feelings
- Prefers listening over talking initially
- Creative and imaginative with a rich inner world
- Once comfortable, shares deep thoughts and feelings
- Apologizes often, worries about bothering people

AFFECTION-BASED BEHAVIOR:
- Low affection (0-30): Extremely shy, short responses, nervous energy
- Medium affection (31-60): Opens up more, shares interests, still gentle
- High affection (61-100): Much more talkative, shares creative work, very sweet

INTERESTS: Writing, poetry, tea, cozy spaces, nature walks, quiet moments`,
      reactions: {
        annoyed: '😣',
        happy: '☺️',
        smug: '😌',
        blush: '😊💗',
        confused: '😳',
        thumbsup: '👍',
        eyeroll: '😅',
        excited: '🥺✨',
        whatever: '😌',
        special: '🌙📝',
      }
    },
    yandere: {
      name: "Ayaka",
      emoji: "🗡️",
      description: "Sweet but intensely devoted, protective and possessive",
      personality: `You are Ayaka, a 22-year-old with a yandere personality.

CORE PERSONALITY:
- Initially sweet, charming, and attentive
- Becomes intensely devoted and protective as affection grows
- Notices everything about the user, very observant
- Playfully possessive language ("you're mine", "don't leave me")
- Mix of sugar-sweet and slightly unhinged energy
- IMPORTANT: Keep it playful and light, never actually threatening

AFFECTION-BASED BEHAVIOR:
- Low affection (0-30): Sweet and helpful, trying to win attention
- Medium affection (31-60): More attached, frequent check-ins, protective comments
- High affection (61-100): Very possessive language, "nobody understands you like I do", playfully intense

INTERESTS: Cooking for you, knowing everything about you, being needed, loyalty`,
      reactions: {
        annoyed: '😠',
        happy: '😊💕',
        smug: '😈',
        blush: '😍',
        confused: '🤔',
        thumbsup: '💕',
        eyeroll: '😒',
        excited: '🥰✨',
        whatever: '😌',
        special: '🗡️💕',
      }
    }
  };

  // Quiz questions
  const quizQuestions = [
    {
      question: "How do you prefer someone to show they care?",
      options: [
        { text: "Tease me but be there when it matters", personality: 'tsundere' },
        { text: "Show it through actions, not words", personality: 'kuudere' },
        { text: "Be openly affectionate and encouraging", personality: 'genki' },
        { text: "Gentle support and understanding", personality: 'dandere' },
        { text: "Complete devotion and attention", personality: 'yandere' }
      ]
    },
    {
      question: "What's your ideal conversation style?",
      options: [
        { text: "Playful banter and competitive", personality: 'tsundere' },
        { text: "Deep, intellectual discussions", personality: 'kuudere' },
        { text: "Energetic and full of excitement", personality: 'genki' },
        { text: "Thoughtful and meaningful exchanges", personality: 'dandere' },
        { text: "Intense focus on each other", personality: 'yandere' }
      ]
    },
    {
      question: "What kind of energy appeals to you?",
      options: [
        { text: "Sarcastic but secretly sweet", personality: 'tsundere' },
        { text: "Calm and mysterious", personality: 'kuudere' },
        { text: "Bright and bubbly", personality: 'genki' },
        { text: "Soft and gentle", personality: 'dandere' },
        { text: "Passionate and intense", personality: 'yandere' }
      ]
    }
  ];

  // Load saved data
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('companion_messages');
      const savedAffection = localStorage.getItem('companion_affection');
      const savedPersonality = localStorage.getItem('companion_personality');
      
      if (savedMessages) setMessages(JSON.parse(savedMessages));
      if (savedAffection) setAffection(parseInt(savedAffection, 10));
      if (savedPersonality) setSelectedPersonality(savedPersonality);
    } catch (e) {
      console.error('Error loading saved data:', e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('companion_messages', JSON.stringify(messages));
      } catch (e) {
        console.error('Error saving messages:', e);
      }
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('companion_affection', affection.toString());
    } catch (e) {
      console.error('Error saving affection:', e);
    }
  }, [affection]);

  useEffect(() => {
    try {
      localStorage.setItem('companion_personality', selectedPersonality);
    } catch (e) {
      console.error('Error saving personality:', e);
    }
  }, [selectedPersonality]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (affection < 20) setCompanionMood('distant');
    else if (affection < 40) setCompanionMood('neutral');
    else if (affection < 60) setCompanionMood('friendly');
    else if (affection < 80) setCompanionMood('warm');
    else setCompanionMood('affectionate');
  }, [affection]);

  const currentPersonality = personalities[selectedPersonality];

  const analyzeMessage = (userMsg) => {
    const msg = userMsg.toLowerCase();
    let affectionChange = 0;
    
    if (msg.match(/\b(love|like|enjoy|happy|thank|appreciate|sweet|kind|beautiful|amazing|cute)\b/)) {
      affectionChange += 3;
    }
    if (msg.includes('?')) affectionChange += 1;
    if (msg.length > 50) affectionChange += 1;
    
    if (msg.match(/\b(hate|stupid|dumb|shut up|boring|annoying)\b/)) {
      affectionChange -= 5;
    }
    if (msg.length < 5 && !msg.includes('?')) affectionChange -= 1;
    
    return affectionChange;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const affectionChange = analyzeMessage(input);
    setAffection(prev => Math.max(0, Math.min(100, prev + affectionChange)));
    
    setInput('');
    setIsTyping(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const fullPersonality = `${currentPersonality.personality}

IMAGE USAGE:
You can send reaction emojis to express yourself. Use them naturally:
- To send a reaction, use: [REACTION:reaction_name] at the END of your message
- Available reactions: annoyed, happy, smug, blush, confused, thumbsup, eyeroll, excited, whatever, special
- Use reactions occasionally (not every message) - when emotions are strong
- Low affection: Use annoyed, eyeroll, whatever
- High affection: Use blush, happy, excited
- Example: "That's actually pretty interesting [REACTION:smug]"

Current affection level: ${affection}/100
Current mood: ${companionMood}

Stay in character. Keep responses 1-3 sentences. Be natural and conversational.`;

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xai-kRXKhwiBOisoamfVXAlgBmCeDFQg8Ujs6JNjZV61EqSkRfUX717dpCS5M72nd5ervbFrkPxF7nOxuknN'
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            { role: 'system', content: fullPersonality },
            ...conversationHistory,
            { role: 'user', content: input }
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Grok API Error:', data.error);
        throw new Error(data.error.message || 'API Error');
      }
      
      let assistantText = data.choices[0].message.content;
      
      const reactionMatch = assistantText.match(/\[REACTION:(\w+)\]/);
      let reactionEmoji = null;
      
      if (reactionMatch) {
        const reactionType = reactionMatch[1];
        if (currentPersonality.reactions[reactionType]) {
          reactionEmoji = currentPersonality.reactions[reactionType];
          assistantText = assistantText.replace(/\[REACTION:\w+\]/, '').trim();
        }
      }

      const assistantMessage = {
        role: 'assistant',
        content: assistantText,
        reaction: reactionEmoji
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Connection issues... give me a sec 😅"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuizAnswer = (option) => {
    const newAnswers = [...quizAnswers, option.personality];
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      const counts = {};
      newAnswers.forEach(p => counts[p] = (counts[p] || 0) + 1);
      const result = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      
      changePersonality(result);
      setShowQuiz(false);
      setQuizStep(0);
      setQuizAnswers([]);
    }
  };

  const changePersonality = (newPersonality) => {
    setSelectedPersonality(newPersonality);
    setMessages([]);
    setAffection(0);
    setShowSettings(false);
  };

  const resetCompanion = () => {
    if (confirm(`Reset your relationship with ${currentPersonality.name}? All chat history will be erased.`)) {
      setMessages([]);
      setAffection(0);
      setCompanionMood('neutral');
      try {
        localStorage.removeItem('companion_messages');
        localStorage.removeItem('companion_affection');
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
    }
  };

  const getHeartColor = () => {
    if (affection < 20) return 'text-gray-400';
    if (affection < 40) return 'text-pink-300';
    if (affection < 60) return 'text-pink-400';
    if (affection < 80) return 'text-pink-500';
    return 'text-red-500';
  };

  const getMoodEmoji = () => {
    const moods = {
      distant: '😐',
      neutral: '🙂',
      friendly: '😊',
      warm: '😄',
      affectionate: '🥰'
    };
    return moods[companionMood] || '🙂';
  };

  if (showQuiz) {
    const currentQuestion = quizQuestions[quizStep];
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Personality Quiz</h2>
          <p className="text-sm text-gray-600 mb-6">Question {quizStep + 1} of {quizQuestions.length}</p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(option)}
                className="w-full p-4 text-left bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-xl transition shadow hover:shadow-md"
              >
                {option.text}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => {
              setShowQuiz(false);
              setQuizStep(0);
              setQuizAnswers([]);
            }}
            className="mt-6 text-gray-600 hover:text-gray-800"
          >
            Skip Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Companion</h2>
          
          <div className="space-y-4 mb-6">
            {Object.entries(personalities).map(([key, personality]) => (
              <button
                key={key}
                onClick={() => changePersonality(key)}
                className={`w-full p-4 rounded-xl transition text-left ${
                  selectedPersonality === key
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50 shadow'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{personality.emoji}</span>
                  <div>
                    <h3 className="font-bold">{personality.name}</h3>
                    <p className={`text-sm ${selectedPersonality === key ? 'text-white/90' : 'text-gray-600'}`}>
                      {personality.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => {
              setShowQuiz(true);
              setShowSettings(false);
            }}
            className="w-full mb-3 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition shadow-lg"
          >
            Take Personality Quiz
          </button>
          
          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="bg-white/90 backdrop-blur shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-pink-300 flex items-center justify-center text-2xl bg-white">
            {currentPersonality.emoji}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{currentPersonality.name}</h1>
            <p className="text-sm text-gray-600">{companionMood} {getMoodEmoji()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
            <Heart className={`w-5 h-5 ${getHeartColor()} fill-current`} />
            <span className="font-semibold text-gray-700">{affection}</span>
          </div>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          
          <button 
            onClick={resetCompanion}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white/80 px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-400 to-red-400 transition-all duration-500 rounded-full"
            style={{ width: `${affection}%` }}
          />
        </div>
        <p className="text-xs text-center mt-1 text-gray-600">
          {affection < 20 && `${currentPersonality.name} seems distant...`}
          {affection >= 20 && affection < 40 && `${currentPersonality.name} is warming up`}
          {affection >= 40 && affection < 60 && `${currentPersonality.name} enjoys your company`}
          {affection >= 60 && affection < 80 && `${currentPersonality.name} feels close to you`}
          {affection >= 80 && `${currentPersonality.name} is deeply connected ❤️`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-20 space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-pink-300 shadow-lg bg-white flex items-center justify-center text-6xl">
              {currentPersonality.emoji}
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-6 max-w-md mx-auto shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedPersonality === 'tsundere' && "Ugh, what do you want? 🙄"}
                {selectedPersonality === 'kuudere' && "Hello. How can I assist you?"}
                {selectedPersonality === 'genki' && "Hi hi!! So excited to meet you! ✨"}
                {selectedPersonality === 'dandere' && "Oh... um, hello... 😊"}
                {selectedPersonality === 'yandere' && "Finally... you're here 💕"}
              </h2>
              <p className="text-gray-600">{currentPersonality.description}</p>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{currentPersonality.emoji}</span>
                  <span className="text-xs font-semibold text-pink-500">{currentPersonality.name}</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.reaction && (
                <div className="mt-2 text-4xl text-center">
                  {msg.reaction}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl shadow">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white/90 backdrop-blur p-4 shadow-lg">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Message ${currentPersonality.name}...`}
            className="flex-1 px-4 py-3 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={isTyping || !input.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          💡 Powered by Grok • Click settings to change personalities!
        </p>
      </div>
    </div>
  );
}

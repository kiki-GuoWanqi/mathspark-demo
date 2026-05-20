const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const mockData = {
  emma: {
    child: { name: 'Emma', age: 8, grade: 'Grade 3', avatar: '🦄' },
    summary: {
      headline: "Emma had a fantastic week! 🎉",
      subline: "Her accuracy jumped 15% and she stayed focused for 28 minutes straight — her best record yet!"
    },
    stats: {
      skillsMastered: { thisWeek: 7, lastWeek: 5 },
      focusMinutes: { thisWeek: 142, lastWeek: 98 },
      streak: 12
    },
    weeklyTrend: [
      { week: 'Apr 7',  skills: 3, summary: 'Kicked off April with solid addition & subtraction foundations.' },
      { week: 'Apr 14', skills: 4, summary: 'Conquered place value — a big confidence unlock!' },
      { week: 'Apr 21', skills: 5, summary: 'First multiplication sessions went surprisingly well.' },
      { week: 'Apr 28', skills: 4, summary: 'Consolidation week — reinforced earlier skills deeply.' },
      { week: 'May 5',  skills: 6, summary: 'Geometry and word problems both clicked this week!' },
      { week: 'May 12', skills: 7, summary: 'Best week yet! Fractions landed and accuracy hit 91%.' }
    ],
    heatmap: [
      { day: 'Mon', minutes: 28, skills: ['Multiplication Tables', 'Word Problems'] },
      { day: 'Tue', minutes: 15, skills: ['Fractions Intro'] },
      { day: 'Wed', minutes: 32, skills: ['Multiplication', 'Geometry', 'Division Intro'] },
      { day: 'Thu', minutes: 20, skills: ['Word Problems', 'Place Value'] },
      { day: 'Fri', minutes: 25, skills: ['Fractions', 'Multiplication Review'] },
      { day: 'Sat', minutes: 12, skills: ['Math Games', 'Quick Quiz'] },
      { day: 'Sun', minutes: 10, skills: ['Flashcard Review'] }
    ],
    highlight: {
      title: "🏆 Breakthrough Moment",
      content: "On Wednesday, Emma solved 12 multiplication problems in a row without a single mistake — a new personal best! She even helped herself by drawing diagrams when she got stuck."
    },
    skillsProgress: [
      { name: 'Multiplication', percent: 85, done: true,  mastered: 43, total: 50, masteredDate: 'May 15',
        questions: [{ q:'7 × 8 = ?', a:'56', correct:true },{ q:'9 × 6 = ?', a:'54', correct:true },{ q:'12 × 4 = ?', a:'48', correct:true }] },
      { name: 'Fractions',      percent: 62, done: false, mastered: 31, total: 50, masteredDate: null,
        questions: [{ q:'1/2 + 1/4 = ?', a:'3/4', correct:true },{ q:'3/4 − 1/4 = ?', a:'1/2', correct:false },{ q:'Which is larger: 2/3 or 3/4?', a:'3/4', correct:true }] },
      { name: 'Word Problems',  percent: 74, done: false, mastered: 37, total: 50, masteredDate: null,
        questions: [{ q:'Tom has 24 apples, gives 8 away. How many left?', a:'16', correct:true },{ q:'Train at 60 mph for 2 hrs. Distance?', a:'120 mi', correct:false },{ q:'3 packs × 6 cookies. Total?', a:'18', correct:true }] },
      { name: 'Geometry',       percent: 91, done: true,  mastered: 46, total: 50, masteredDate: 'May 13',
        questions: [{ q:'Sides of a hexagon?', a:'6', correct:true },{ q:'Perimeter of 4×3 rectangle?', a:'14', correct:true },{ q:'Area: base 6, height 4?', a:'12', correct:true }] }
    ],
    nextWeek: {
      skills: ['Division basics', 'Mixed fractions', 'Area & perimeter'],
      motivation: "Emma is on a roll! With 12 days of consistent practice, she's building the kind of deep number sense that will carry her through middle school math with confidence."
    },
    subscription: { daysLeft: 18, price: '$9.99/mo' }
  },
  liam: {
    child: { name: 'Liam', age: 10, grade: 'Grade 5', avatar: '🚀' },
    summary: {
      headline: "Liam is on a winning streak! 🚀",
      subline: "He tackled advanced algebra concepts this week and his problem-solving speed improved by 22%!"
    },
    stats: {
      skillsMastered: { thisWeek: 9, lastWeek: 7 },
      focusMinutes: { thisWeek: 185, lastWeek: 160 },
      streak: 21
    },
    weeklyTrend: [
      { week: 'Apr 7',  skills: 5, summary: 'Strong start — algebra fundamentals locked in.' },
      { week: 'Apr 14', skills: 6, summary: 'Decimals mastered faster than expected.' },
      { week: 'Apr 21', skills: 7, summary: 'Speed record: finished a 20-question quiz in 8 min!' },
      { week: 'Apr 28', skills: 7, summary: 'Consolidated ratios — harder than expected.' },
      { week: 'May 5',  skills: 8, summary: 'Statistics intro went smoothly; great focus this week.' },
      { week: 'May 12', skills: 9, summary: 'Nine skills in one week — a personal record!' }
    ],
    heatmap: [
      { day: 'Mon', minutes: 35, skills: ['Algebra Equations', 'Ratios'] },
      { day: 'Tue', minutes: 40, skills: ['Decimals', 'Percentages', 'Statistics'] },
      { day: 'Wed', minutes: 28, skills: ['Word Problems', 'Ratios'] },
      { day: 'Thu', minutes: 38, skills: ['Statistics', 'Data Charts'] },
      { day: 'Fri', minutes: 22, skills: ['Mixed Review'] },
      { day: 'Sat', minutes: 15, skills: ['Speed Drills'] },
      { day: 'Sun', minutes: 7,  skills: ['Flashcards'] }
    ],
    highlight: {
      title: "⚡ Speed Champion",
      content: "Liam completed a 20-question algebra quiz in just 8 minutes with 95% accuracy — faster than 97% of kids his age on MathSpark!"
    },
    skillsProgress: [
      { name: 'Algebra Basics', percent: 95, done: true,  mastered: 48, total: 50, masteredDate: 'May 14',
        questions: [{ q:'Solve: 2x + 3 = 11', a:'x = 4', correct:true },{ q:'Simplify: 3(x+2)', a:'3x+6', correct:true },{ q:'If x=5, find 2x−3', a:'7', correct:true }] },
      { name: 'Decimals',       percent: 88, done: true,  mastered: 44, total: 50, masteredDate: 'May 11',
        questions: [{ q:'0.25 + 1.5 = ?', a:'1.75', correct:true },{ q:'3.6 × 2 = ?', a:'7.2', correct:true },{ q:'5.0 ÷ 0.5 = ?', a:'10', correct:true }] },
      { name: 'Ratios',         percent: 71, done: false, mastered: 36, total: 50, masteredDate: null,
        questions: [{ q:'Simplify ratio 8:12', a:'2:3', correct:true },{ q:'If 3:x = 1:4, find x', a:'12', correct:false },{ q:'Scale 1:50. Model is 4cm. Real size?', a:'200cm', correct:true }] },
      { name: 'Statistics',     percent: 54, done: false, mastered: 27, total: 50, masteredDate: null,
        questions: [{ q:'Mean of 4, 8, 6, 10?', a:'7', correct:true },{ q:'Median of 3,5,7,9,11?', a:'7', correct:true },{ q:'Mode of 2,3,3,4,5?', a:'3', correct:false }] }
    ],
    nextWeek: {
      skills: ['Ratio & proportion', 'Percentage problems', 'Intro to equations'],
      motivation: "Liam's 21-day streak is remarkable! He's showing genuine mathematical maturity — tackling hard problems calmly and checking his work independently."
    },
    subscription: { daysLeft: 5, price: '$9.99/mo' }
  },
  sophia: {
    child: { name: 'Sophia', age: 7, grade: 'Grade 2', avatar: '🌸' },
    summary: {
      headline: "Sophia is blooming in math! 🌸",
      subline: "She went from hesitant to confident with addition this week — completing 40 exercises with a big smile!"
    },
    stats: {
      skillsMastered: { thisWeek: 5, lastWeek: 3 },
      focusMinutes: { thisWeek: 95, lastWeek: 72 },
      streak: 7
    },
    weeklyTrend: [
      { week: 'Apr 7',  skills: 1, summary: 'First week! Sophia warmed up with number recognition.' },
      { week: 'Apr 14', skills: 2, summary: 'Addition with fingers — slow but building confidence.' },
      { week: 'Apr 21', skills: 2, summary: 'Practiced the same skills — repetition is paying off.' },
      { week: 'Apr 28', skills: 3, summary: 'Subtraction introduced — she loves the visuals!' },
      { week: 'May 5',  skills: 4, summary: 'Place value clicked — counting in tens mastered!' },
      { week: 'May 12', skills: 5, summary: 'Asked for extra rounds — math is officially fun now.' }
    ],
    heatmap: [
      { day: 'Mon', minutes: 20, skills: ['Addition', 'Counting'] },
      { day: 'Tue', minutes: 18, skills: ['Subtraction Intro'] },
      { day: 'Wed', minutes: 22, skills: ['Addition', 'Simple Shapes'] },
      { day: 'Thu', minutes: 10, skills: ['Number Recognition'] },
      { day: 'Fri', minutes: 15, skills: ['Counting', 'Place Value'] },
      { day: 'Sat', minutes: 5,  skills: ['Fun Math Games'] },
      { day: 'Sun', minutes: 5,  skills: ['Sticker Flashcards'] }
    ],
    highlight: {
      title: "🌟 Confidence Leap",
      content: "For the first time, Sophia asked to do 'one more round' after finishing her daily session — a sure sign that math is becoming fun, not scary!"
    },
    skillsProgress: [
      { name: 'Addition (2-digit)', percent: 90, done: true,  mastered: 45, total: 50, masteredDate: 'May 16',
        questions: [{ q:'14 + 23 = ?', a:'37', correct:true },{ q:'36 + 18 = ?', a:'54', correct:true },{ q:'47 + 29 = ?', a:'76', correct:true }] },
      { name: 'Subtraction',        percent: 75, done: false, mastered: 38, total: 50, masteredDate: null,
        questions: [{ q:'30 − 14 = ?', a:'16', correct:true },{ q:'52 − 27 = ?', a:'25', correct:false },{ q:'40 − 19 = ?', a:'21', correct:true }] },
      { name: 'Place Value',        percent: 95, done: true,  mastered: 48, total: 50, masteredDate: 'May 12',
        questions: [{ q:'What is the tens digit of 74?', a:'7', correct:true },{ q:'Write 3 tens and 8 ones', a:'38', correct:true },{ q:'Which is bigger: 46 or 64?', a:'64', correct:true }] },
      { name: 'Simple Shapes',      percent: 60, done: false, mastered: 30, total: 50, masteredDate: null,
        questions: [{ q:'How many corners does a triangle have?', a:'3', correct:true },{ q:'Name a shape with 4 equal sides', a:'Square', correct:true },{ q:'How many sides does a circle have?', a:'0', correct:false }] }
    ],
    nextWeek: {
      skills: ['3-digit addition', 'Telling time', 'Simple multiplication'],
      motivation: "Sophia's love for learning is her greatest superpower. At this pace, she'll be ahead of her grade level by summer — and she's having fun doing it!"
    },
    subscription: { daysLeft: 42, price: '$9.99/mo' }
  }
};

app.get('/api/report/:childId', (req, res) => {
  const { childId } = req.params;
  const data = mockData[childId.toLowerCase()];
  if (!data) {
    return setTimeout(() => res.status(404).json({ error: 'Child not found' }), 200);
  }
  setTimeout(() => res.json(data), 200);
});

app.post('/api/renew', (req, res) => {
  const { childId, plan } = req.body;
  const success = Math.random() < 0.9;
  setTimeout(() => {
    if (success) {
      res.json({ success: true, message: 'Subscription renewed! 🎉', nextBilling: '2025-07-01' });
    } else {
      res.json({ success: false, message: 'Payment failed, please try again.' });
    }
  }, 300);
});

app.get('/api/report/:childId/details', (req, res) => {
  setTimeout(() => res.json({ locked: true, upgradeUrl: '/upgrade' }), 150);
});

app.use((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'));
});

app.listen(3001, () => {
  console.log('');
  console.log('  🚀 MathSpark running!');
  console.log('  👉 Open: http://localhost:3001');
  console.log('');
});

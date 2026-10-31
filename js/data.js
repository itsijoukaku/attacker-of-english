/* Attacker of English — lesson & question data (English side).
 * 12 levels = 12 English tenses. Each question lists the correct answer first;
 * options are shuffled at runtime. "___" marks the blank.
 * Chinese names, usage notes, translations and explanations live in data-zh.js.
 */
window.AOE_DATA = (function () {
  const q = (text, opts) => ({ text, opts });

  const LEVELS = [
    {
      id: 1, category: 'present', tense: 'Simple Present',
      formula: {
        positive: 'Subject + V1 (he/she/it + V-s/es)',
        negative: 'Subject + do/does + not + V1',
        question: 'Do/Does + subject + V1 ?'
      },
      signals: ['always', 'usually', 'often', 'every day', 'never', 'on Mondays'],
      examples: [
        'Isagi **trains** every morning before breakfast.',
        'Strikers **don’t pass** when they see a chance to score.',
        '**Does** Nagi **practice** his trapping? — Only when he feels like it.'
      ],
      questions: [
        q('Isagi ___ (train) every morning at 6 a.m.', ['trains', 'is training', 'trained', 'has trained']),
        q('Bachira ___ (not / like) boring football.', ['doesn’t like', 'isn’t liking', 'didn’t like', 'don’t like']),
        q('___ Nagi ___ (play) only when he feels like it?', ['Does … play', 'Is … playing', 'Did … play', 'Do … play']),
        q('The ball ___ (roll) faster on wet grass.', ['rolls', 'is rolling', 'rolled', 'roll']),
        q('Blue Lock strikers always ___ (want) the goal.', ['want', 'wants', 'are wanting', 'wanted']),
        q('Ego ___ (say) the same thing every day: “Be selfish.”', ['says', 'is saying', 'said', 'say']),
        q('We usually ___ (meet) in the cafeteria after drills.', ['meet', 'are meeting', 'met', 'meets']),
        q('The schedule says the match ___ (start) at 7 p.m. sharp.', ['starts', 'start', 'has started', 'starting'])
      ]
    },
    {
      id: 2, category: 'present', tense: 'Present Continuous',
      formula: {
        positive: 'Subject + am/is/are + V-ing',
        negative: 'Subject + am/is/are + not + V-ing',
        question: 'Am/Is/Are + subject + V-ing ?'
      },
      signals: ['now', 'right now', 'at the moment', 'Look!', 'Listen!', 'this week'],
      examples: [
        'Look! Isagi **is running** into the open space.',
        'Bachira **isn’t passing** — he**’s dribbling** past three defenders.',
        'We **are playing** Team V tomorrow. It’s already arranged.'
      ],
      questions: [
        q('Look! Isagi ___ (run) toward the goal right now.', ['is running', 'runs', 'ran', 'has run']),
        q('Bachira and Isagi ___ (pass) the ball to each other at the moment.', ['are passing', 'pass', 'is passing', 'passed']),
        q('Quiet! Ego ___ (watch) the monitors.', ['is watching', 'watches', 'watched', 'has watched']),
        q('___ you ___ (listen) to me, striker?', ['Are … listening', 'Do … listen', 'Did … listen', 'Have … listened']),
        q('Nagi ___ (not / sleep) now — he is thinking about a new trap.', ['isn’t sleeping', 'doesn’t sleep', 'didn’t sleep', 'hasn’t slept']),
        q('This season, Team Z ___ (get) stronger every week.', ['is getting', 'gets', 'got', 'has got']),
        q('We ___ (play) Team V tomorrow — it’s already arranged.', ['are playing', 'play', 'played', 'have played']),
        q('Why ___ Kunigami ___ (stand) there alone?', ['is … standing', 'does … stand', 'did … stand', 'has … stood'])
      ]
    },
    {
      id: 3, category: 'present', tense: 'Present Perfect',
      formula: {
        positive: 'Subject + have/has + V3',
        negative: 'Subject + have/has + not + V3',
        question: 'Have/Has + subject + V3 ?'
      },
      signals: ['ever', 'never', 'just', 'already', 'yet', 'so far', 'since', 'for'],
      examples: [
        'Isagi **has scored** three goals so far.',
        '**Have** you ever **played** against Rin?',
        'Chigiri **hasn’t run** at full speed yet.'
      ],
      questions: [
        q('Isagi ___ (score) three goals so far this season.', ['has scored', 'scored', 'is scoring', 'scores']),
        q('I ___ never ___ (feel) such pressure before.', ['have … felt', 'did … feel', 'am … feeling', 'had … felt']),
        q('___ you ever ___ (play) against Rin?', ['Have … played', 'Did … play', 'Do … play', 'Are … playing']),
        q('Team Z ___ just ___ (win) their first match!', ['has … won', 'did … win', 'is … winning', 'had … won']),
        q('Chigiri ___ (not / run) at full speed yet.', ['hasn’t run', 'didn’t run', 'isn’t running', 'doesn’t run']),
        q('We ___ (be) in Blue Lock since March.', ['have been', 'are', 'were', 'had been']),
        q('Barou ___ (already / take) the shot.', ['has already taken', 'is already taking', 'already takes', 'had already take']),
        q('How many goals ___ Bachira ___ (score) since the first selection?', ['has … scored', 'did … score', 'does … score', 'is … scoring'])
      ]
    },
    {
      id: 4, category: 'present', tense: 'Present Perfect Continuous',
      formula: {
        positive: 'Subject + have/has + been + V-ing',
        negative: 'Subject + have/has + not + been + V-ing',
        question: 'Have/Has + subject + been + V-ing ?'
      },
      signals: ['for two hours', 'since lunch', 'all day', 'lately', 'recently', 'How long …?'],
      examples: [
        'Isagi **has been practicing** his direct shot for three hours.',
        'You’re soaked. **Have** you **been running** laps?',
        'Bachira **hasn’t been training** lately.'
      ],
      questions: [
        q('Isagi ___ (practice) his direct shot for three hours.', ['has been practicing', 'is practicing', 'practiced', 'practices']),
        q('You look exhausted. ___ you ___ (run) laps?', ['Have … been running', 'Do … run', 'Did … run', 'Are … run']),
        q('Nagi ___ (play) video games since lunch.', ['has been playing', 'is playing', 'plays', 'played']),
        q('We ___ (wait) for the results all morning.', ['have been waiting', 'are waiting', 'waited', 'wait']),
        q('How long ___ Chigiri ___ (recover) from his injury?', ['has … been recovering', 'does … recover', 'is … recovering', 'did … recover']),
        q('Bachira ___ (not / train) lately; he looks rusty.', ['hasn’t been training', 'isn’t training', 'doesn’t train', 'didn’t train']),
        q('It ___ (rain) all day, so the pitch is muddy.', ['has been raining', 'is raining', 'rains', 'rained']),
        q('The coaches ___ (study) our data for weeks.', ['have been studying', 'are studying', 'study', 'studied'])
      ]
    },
    {
      id: 5, category: 'past', tense: 'Simple Past',
      formula: {
        positive: 'Subject + V2 (played / went)',
        negative: 'Subject + did + not + V1',
        question: 'Did + subject + V1 ?'
      },
      signals: ['yesterday', 'last night', 'ago', 'in 2018', 'when I was a child'],
      examples: [
        'Isagi **scored** the winning goal yesterday.',
        'We **didn’t win** the first match.',
        '**Did** Ego **choose** 300 strikers? — Yes, he **did**.'
      ],
      questions: [
        q('Isagi ___ (score) the winning goal yesterday.', ['scored', 'scores', 'has scored', 'is scoring']),
        q('We ___ (not / win) the first match.', ['didn’t win', 'haven’t won', 'don’t win', 'weren’t win']),
        q('___ Ego ___ (choose) 300 strikers last year?', ['Did … choose', 'Has … chosen', 'Does … choose', 'Was … choosing']),
        q('Bachira ___ (meet) his “monster” when he was a child.', ['met', 'meets', 'has met', 'meeting']),
        q('Last night, Team Z ___ (go) to bed early.', ['went', 'goes', 'has gone', 'was go']),
        q('Rin ___ (take) the ball and shot.', ['took', 'takes', 'has taken', 'was taking']),
        q('In 2018, Japan ___ (lose) to Belgium in the World Cup.', ['lost', 'has lost', 'loses', 'was losing']),
        q('Where ___ you during the meeting yesterday?', ['were', 'have been', 'are', 'did'])
      ]
    },
    {
      id: 6, category: 'past', tense: 'Past Continuous',
      formula: {
        positive: 'Subject + was/were + V-ing',
        negative: 'Subject + was/were + not + V-ing',
        question: 'Was/Were + subject + V-ing ?'
      },
      signals: ['while', 'when', 'at 9 p.m. last night', 'all evening', 'at that moment'],
      examples: [
        'Isagi **was dribbling** when the defender tackled him.',
        'While Bachira **was dancing** with the ball, Isagi found space.',
        'What **were** you **doing** at midnight?'
      ],
      questions: [
        q('Isagi ___ (dribble) when the defender tackled him.', ['was dribbling', 'dribbled', 'is dribbling', 'has dribbled']),
        q('At 9 p.m. last night, we ___ (watch) match videos.', ['were watching', 'watched', 'are watching', 'have watched']),
        q('While Bachira ___ (dance) with the ball, Isagi found space.', ['was dancing', 'danced', 'is dancing', 'has danced']),
        q('What ___ you ___ (do) when the alarm rang?', ['were … doing', 'did … do', 'are … doing', 'have … done']),
        q('At midnight, I ___ (not / sleep) — I was studying plays.', ['wasn’t sleeping', 'didn’t sleep', 'am not sleeping', 'haven’t slept']),
        q('It ___ (snow) heavily when the bus arrived at Blue Lock.', ['was snowing', 'snowed', 'is snowing', 'has snowed']),
        q('Kunigami ___ (lift) weights while Chigiri was stretching.', ['was lifting', 'lifts', 'is lifting', 'has lifted']),
        q('Was Nagi ___ (sleep) during the meeting?', ['sleeping', 'slept', 'sleeps', 'sleep'])
      ]
    },
    {
      id: 7, category: 'past', tense: 'Past Perfect',
      formula: {
        positive: 'Subject + had + V3',
        negative: 'Subject + had + not + V3',
        question: 'Had + subject + V3 ?'
      },
      signals: ['already', 'before', 'after', 'by the time', 'by halftime', 'never … before'],
      examples: [
        'When Isagi arrived, the match **had** already **started**.',
        'Ego was angry because Team W **hadn’t followed** the plan.',
        '**Had** you **seen** Rin play before the U-20 match?'
      ],
      questions: [
        q('When Isagi arrived, the match ___ already ___ (start).', ['had … started', 'has … started', 'was … starting', 'did … start']),
        q('Bachira ___ never ___ (meet) a partner like Isagi before Blue Lock.', ['had … met', 'has … met', 'was … meeting', 'did … meet']),
        q('After they ___ (finish) training, they ate dinner.', ['had finished', 'have finished', 'were finishing', 'finish']),
        q('Ego was angry because Team W ___ (not / follow) the plan.', ['hadn’t followed', 'haven’t followed', 'weren’t following', 'don’t follow']),
        q('___ you ___ (see) Rin play before the U-20 match?', ['Had … seen', 'Have … seen', 'Were … seeing', 'Do … see']),
        q('By halftime, Barou ___ (take) five shots.', ['had taken', 'has taken', 'is taking', 'takes']),
        q('I realized I ___ (forget) my boots at the dorm.', ['had forgotten', 'have forgotten', 'was forgetting', 'forget']),
        q('The keeper ___ (move) before Isagi shot, so the goal was open.', ['had moved', 'has moved', 'is moving', 'moves'])
      ]
    },
    {
      id: 8, category: 'past', tense: 'Past Perfect Continuous',
      formula: {
        positive: 'Subject + had + been + V-ing',
        negative: 'Subject + had + not + been + V-ing',
        question: 'Had + subject + been + V-ing ?'
      },
      signals: ['for hours', 'since morning', 'all night', 'before', 'when', 'How long … had …?'],
      examples: [
        'Isagi **had been training** for hours before he finally scored.',
        'The players were tired because they **had been running** all morning.',
        'Nagi’s eyes were red; he **had been playing** games all night.'
      ],
      questions: [
        q('Isagi ___ (train) for hours before he finally scored.', ['had been training', 'has been training', 'is training', 'trains']),
        q('The players were tired because they ___ (run) all morning.', ['had been running', 'have been running', 'are running', 'run']),
        q('How long ___ Chigiri ___ (wait) before he got his chance?', ['had … been waiting', 'has … been waiting', 'is … waiting', 'does … wait']),
        q('Bachira ___ (look) for a partner for years when he met Isagi.', ['had been looking', 'has been looking', 'looks', 'is looking']),
        q('The pitch was wet because it ___ (rain).', ['had been raining', 'has been raining', 'rains', 'is raining']),
        q('We ___ (not / practice) long when the coach stopped us.', ['hadn’t been practicing', 'haven’t been practicing', 'aren’t practicing', 'don’t practice']),
        q('Nagi’s eyes were red; he ___ (play) games all night.', ['had been playing', 'has been playing', 'plays', 'is playing']),
        q('They ___ (argue) for ten minutes before Ego interrupted.', ['had been arguing', 'have been arguing', 'argue', 'are arguing'])
      ]
    },
    {
      id: 9, category: 'future', tense: 'Simple Future',
      formula: {
        positive: 'Subject + will + V1  /  am/is/are going to + V1',
        negative: 'Subject + will not (won’t) + V1',
        question: 'Will + subject + V1 ?'
      },
      signals: ['tomorrow', 'next week', 'someday', 'soon', 'I think …', 'Look at …'],
      examples: [
        'I **will become** the best striker in the world!',
        'Don’t worry — I**’ll pass** you the ball.',
        'Look at those clouds. It**’s going to rain** during the match.'
      ],
      questions: [
        q('I ___ (become) the best striker in the world!', ['will become', 'became', 'have become', 'had become']),
        q('Don’t worry, I ___ (pass) you the ball.', ['will pass', 'passed', 'have passed', 'had passed']),
        q('___ Japan ___ (win) the World Cup someday?', ['Will … win', 'Did … win', 'Has … won', 'Is … win']),
        q('Isagi ___ (not / give) up — he never does.', ['won’t give', 'didn’t give', 'hasn’t given', 'doesn’t gives']),
        q('Look at those clouds — it ___ (rain) during the match.', ['is going to rain', 'rained', 'has rained', 'had rained']),
        q('I’ve decided: I ___ (learn) Rin’s style this summer.', ['am going to learn', 'learned', 'have learned', 'had learned']),
        q('The doors are heavy. I ___ (help) you open them.', ['will help', 'helped', 'have helped', 'had helped']),
        q('Ego ___ (announce) the results tomorrow morning.', ['will announce', 'announced', 'has announced', 'had announced'])
      ]
    },
    {
      id: 10, category: 'future', tense: 'Future Continuous',
      formula: {
        positive: 'Subject + will be + V-ing',
        negative: 'Subject + will not (won’t) be + V-ing',
        question: 'Will + subject + be + V-ing ?'
      },
      signals: ['this time tomorrow', 'at 8 p.m. tomorrow', 'in ten years', 'next week at this time'],
      examples: [
        'This time tomorrow, we **will be playing** against Team V.',
        'Don’t call me at noon — I**’ll be training**.',
        '**Will** you **be using** the gym later?'
      ],
      questions: [
        q('This time tomorrow, we ___ (play) against Team V.', ['will be playing', 'have played', 'are play', 'played']),
        q('At 8 p.m., Isagi ___ (watch) match footage.', ['will be watching', 'watched', 'has watched', 'had watched']),
        q('Don’t call me at noon — I ___ (train).', ['will be training', 'trained', 'have trained', 'had trained']),
        q('___ you ___ (use) the gym later? I need it.', ['Will … be using', 'Did … use', 'Have … used', 'Do … using']),
        q('In ten years, Nagi ___ (play) in Europe.', ['will be playing', 'played', 'has played', 'had played']),
        q('We ___ (not / rest) during the holidays.', ['won’t be resting', 'didn’t rest', 'haven’t rested', 'aren’t rest']),
        q('Next week at this time, Chigiri ___ (run) the 100m test.', ['will be running', 'ran', 'has run', 'had run']),
        q('The fans ___ (wait) outside when the bus arrives.', ['will be waiting', 'waited', 'have waited', 'had waited'])
      ]
    },
    {
      id: 11, category: 'future', tense: 'Future Perfect',
      formula: {
        positive: 'Subject + will have + V3',
        negative: 'Subject + will not (won’t) have + V3',
        question: 'Will + subject + have + V3 ?'
      },
      signals: ['by tomorrow', 'by 2030', 'by the end of', 'by the time', 'before'],
      examples: [
        'By the end of the season, Isagi **will have scored** 20 goals.',
        'The match **will have finished** by the time you arrive.',
        'Bachira **won’t have recovered** by Saturday.'
      ],
      questions: [
        q('By the end of the season, Isagi ___ (score) 20 goals.', ['will have scored', 'will score', 'scored', 'has scored']),
        q('By 2030, Japan ___ (win) the World Cup.', ['will have won', 'wins', 'won', 'has won']),
        q('The match ___ (finish) by the time you arrive.', ['will have finished', 'finished', 'finishes', 'has finished']),
        q('___ you ___ (complete) the drill by 6 p.m.?', ['Will … have completed', 'Did … complete', 'Have … completed', 'Do … complete']),
        q('Bachira ___ (not / recover) by next Saturday.', ['won’t have recovered', 'didn’t recover', 'hasn’t recovered', 'doesn’t recover']),
        q('By next month, we ___ (be) in Blue Lock for a year.', ['will have been', 'were', 'have been', 'are']),
        q('By the time Ego finishes his speech, Nagi ___ (fall) asleep.', ['will have fallen', 'fell', 'has fallen', 'falls']),
        q('In two hours, the team ___ (watch) every replay.', ['will have watched', 'watched', 'has watched', 'watches'])
      ]
    },
    {
      id: 12, category: 'future', tense: 'Future Perfect Continuous',
      formula: {
        positive: 'Subject + will have been + V-ing',
        negative: 'Subject + will not (won’t) have been + V-ing',
        question: 'Will + subject + have been + V-ing ?'
      },
      signals: ['by 5 p.m. … for six hours', 'by next month … for a year', 'by the time … for'],
      examples: [
        'By 5 p.m., Isagi **will have been training** for six hours.',
        'Next month, we **will have been living** in Blue Lock for a year.',
        'How long **will** you **have been studying** English by December?'
      ],
      questions: [
        q('By 5 p.m., Isagi ___ (train) for six hours.', ['will have been training', 'will train', 'has trained', 'trained']),
        q('Next month, we ___ (live) in Blue Lock for a year.', ['will have been living', 'will live', 'lived', 'live']),
        q('By the final, Rin ___ (play) professionally for two years.', ['will have been playing', 'plays', 'played', 'has played']),
        q('How long ___ you ___ (study) English by the end of this year?', ['will … have been studying', 'did … study', 'do … study', 'are … study']),
        q('By midnight, Nagi ___ (play) games for ten hours straight.', ['will have been playing', 'played', 'plays', 'has played']),
        q('By the time the coach arrives, we ___ (wait) for an hour.', ['will have been waiting', 'waited', 'wait', 'have waited']),
        q('In June, Chigiri ___ (work) on his knee for a year.', ['will have been working', 'worked', 'works', 'has worked']),
        q('They ___ (not / practice) long by the time it gets dark.', ['won’t have been practicing', 'didn’t practice', 'don’t practice', 'haven’t practice'])
      ]
    }
  ];

  const CATEGORIES = [
    { id: 'all', label: '全部' },
    { id: 'present', label: '現在式' },
    { id: 'past', label: '過去式' },
    { id: 'future', label: '未來式' }
  ];

  const STATUSES = [
    { id: 'all', label: '全部' },
    { id: 'new', label: '未開始' },
    { id: 'course', label: '課程完成' },
    { id: 'cleared', label: '已通關' },
    { id: 'locked', label: '未解鎖' }
  ];

  return { LEVELS, CATEGORIES, STATUSES };
})();

import React from 'react';
import styles from './styles/Home.module.css';
import questions from './questions.json';
import { useEffect, useState } from 'react';

const WEIGHTS = {
  MORALITY: 1.4214,
  BOTH: 1.08027,
  REALITY: 0.73913,
};

const ANSWERS = {
  stronglyAgree: 1,
  agree: 0.5,
  neutral: 0,
  disagree: -0.5,
  stronglyDisagree: -1,
};

const toScore = (obj) => Object.values(obj).reduce((sum, val) => sum + val, 0);

const flattened = Object.entries(questions).reduce((array, [key, qs]) => {
  return [
    ...array,
    ...qs.map((question) => ({
      question,
      key,
    })),
  ];
}, []);

const questionToKeyMap = flattened.reduce(
  (acc, { key, question }) => ({
    ...acc,
    [question]: key,
  }),
  {}
);

const TOTAL_RP_POINTS = flattened
  .filter(({ key }) => key.includes('RP'))
  .reduce((sum, { key }) => {
    const [_, weight] = key.split('_');
    return sum + WEIGHTS[weight];
  }, 0);

const TOTAL_BP_POINTS = flattened
  .filter(({ key }) => key.includes('BP'))
  .reduce((sum, { key }) => {
    const [_, weight] = key.split('_');
    return sum + WEIGHTS[weight];
  }, 0);

const toRealityScore = (rpScore, bpScore) => {
  const rpReality = Object.entries(rpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('REALITY');
    })
    .reduce((sum, [_, score]) => sum + score, 0);
  const rpBoth = Object.entries(rpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('BOTH');
    })
    .reduce((sum, [_, score]) => sum + score, 0);
  const bpReality = Object.entries(bpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('REALITY');
    })
    .reduce((sum, [_, score]) => sum + score, 0);
  const bpBoth = Object.entries(bpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('BOTH');
    })
    .reduce((sum, [_, score]) => sum + score, 0);

  return rpReality + rpBoth * 0.5 - bpReality - bpBoth * 0.5;
};

const toMoralityScore = (rpScore, bpScore) => {
  const rpMorality = Object.entries(rpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('MORALITY');
    })
    .reduce((sum, [_, score]) => sum + score, 0);
  const rpBoth = Object.entries(rpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('BOTH');
    })
    .reduce((sum, [_, score]) => sum + score, 0);
  const bpMorality = Object.entries(bpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('MORALITY');
    })
    .reduce((sum, [_, score]) => sum + score, 0);
  const bpBoth = Object.entries(bpScore)
    .filter(([question, score]) => {
      const key = questionToKeyMap[question];
      return key.includes('BOTH');
    })
    .reduce((sum, [_, score]) => sum + score, 0);

  return rpMorality + rpBoth * 0.5 - bpMorality - bpBoth * 0.5;
};

const ScoreTable = ({ reality, morality, percent, onClearAnswers }) => {
  return (
    <>
      <div>Reality Score: {reality.toFixed(2)}</div>
      <div>Morality Score: {morality.toFixed(2)}</div>
      <div>Overall score: {(reality + morality).toFixed(2)}</div>
      <div>Percent RP: {percent.toFixed(0)}%</div>
      <button
        onClick={() => {
          onClearAnswers();
        }}
      >
        CLEAR ANSWERS
      </button>
    </>
  );
};

export default function Home({ admin }) {
  const [rpScore, updateRpScore] = useState({});
  const [bpScore, updateBpScore] = useState({});

  useEffect(() => {
    try {
      const scores = JSON.parse(localStorage.getItem('answers'));
      updateRpScore(scores.rpScore);
      updateBpScore(scores.bpScore);
    } catch { }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'answers',
        JSON.stringify({
          rpScore,
          bpScore,
        })
      );
    }
  }, [rpScore, bpScore]);

  const answer = (ind, questionType, answeredValue) => () => {
    const [pillType, moralityOrReality] = questionType.split('_');
    const score = WEIGHTS[moralityOrReality] * answeredValue;
    if (pillType === 'RP') {
      updateRpScore({
        ...rpScore,
        [ind]: score,
      });
    }
    if (pillType === 'BP') {
      updateBpScore({
        ...bpScore,
        [ind]: score,
      });
    }
  };

  const checked = (ind, questionType, answeredValue) => {
    let map;
    const [pillType, moralityOrReality] = questionType.split('_');
    if (pillType === 'RP') {
      map = rpScore;
    }
    if (pillType === 'BP') {
      map = bpScore;
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!map.hasOwnProperty(ind)) {
      return false;
    }
    const score = WEIGHTS[moralityOrReality] * answeredValue;
    return map[ind] === score;
  };

  const reality = toRealityScore(rpScore, bpScore);
  const morality = toMoralityScore(rpScore, bpScore);
  const percent = ((reality + morality + 51) / 102) * 100;

  const currentRpPoints = Object.keys(rpScore).length;
  const currentBpPoints = Object.keys(bpScore).length;

  const showScoreTable = currentRpPoints + currentBpPoints === flattened.length;
  const showQuestions = !showScoreTable || admin;

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.intro}>
          This quiz is designed to determine your beliefs about
          The Red Pill ideology or lack there of.
          It test both how you believe things to be,
          and how you believe things should be.
          If questions are ambiguous as to whether
          they are about you personally or are
          universal statements, answer how you best see fit.
        </div>
        {showQuestions &&
          flattened.map(({ key, question }, ind) => (
            <div key={`${key}_${ind}`}>
              {admin && <h3>{key}</h3>}
              <>
                <div className={styles.question}>
                  <h4>
                    {ind + 1}: {question}
                  </h4>
                  <div>
                    <input
                      name={question}
                      id={`${ind}_stronglyAgree`}
                      type='radio'
                      value='stronglyAgree'
                      onChange={answer(question, key, ANSWERS.stronglyAgree)}
                      checked={checked(question, key, ANSWERS.stronglyAgree)}
                    />
                    <label htmlFor={`${ind}_stronglyAgree`}>
                      Strongly Agree
                    </label>
                  </div>
                  <div>
                    <input
                      name={question}
                      id={`${ind}_agree`}
                      type='radio'
                      value='agree'
                      onChange={answer(question, key, ANSWERS.agree)}
                      checked={checked(question, key, ANSWERS.agree)}
                    />
                    <label htmlFor={`${ind}_agree`}>Agree</label>
                  </div>
                  <div>
                    {' '}
                    <input
                      name={question}
                      id={`${ind}_neutral`}
                      type='radio'
                      value='neutral'
                      onChange={answer(question, key, ANSWERS.neutral)}
                      checked={checked(question, key, ANSWERS.neutral)}
                    />
                    <label htmlFor={`${ind}_neutral`}>Neutral</label>
                  </div>
                  <div>
                    <input
                      name={question}
                      id={`${ind}_disagree`}
                      type='radio'
                      value='disagree'
                      onChange={answer(question, key, ANSWERS.disagree)}
                      checked={checked(question, key, ANSWERS.disagree)}
                    />
                    <label htmlFor={`${ind}_disagree`}>Disagree</label>
                  </div>
                  <div>
                    {' '}
                    <input
                      name={question}
                      id={`${ind}_stronglyDisagree`}
                      type='radio'
                      value='stronglyDisagree'
                      onChange={answer(question, key, ANSWERS.stronglyDisagree)}
                      checked={checked(question, key, ANSWERS.stronglyDisagree)}
                    />
                    <label htmlFor={`${ind}_stronglyDisagree`}>
                      Strongly Disagree
                    </label>
                  </div>
                </div>
              </>
            </div>
          ))}
      </div>
      <div>
        {showScoreTable && (
          <ScoreTable
            {...{
              rpScore,
              bpScore,
              morality,
              reality,
              percent,
            }}
            onClearAnswers={() => {
              updateBpScore({});
              updateRpScore({});
            }}
          />
        )}
        {!showScoreTable && <>Complete all questions to see results.</>}
        {admin && (
          <>
            <button
              onClick={() => {
                const answers = flattened.reduce((acc, { key, question }) => {
                  const [pill, weight] = key.split('_');
                  const score = WEIGHTS[weight];

                  return {
                    rp: {
                      ...acc.rp,
                      ...(pill === 'RP' ? { [question]: score } : {}),
                    },
                    bp: {
                      ...acc.bp,
                      ...(pill === 'BP' ? { [question]: score * -1 } : {}),
                    },
                  };
                }, {});
                updateRpScore(answers.rp);
                updateBpScore(answers.bp);
              }}
            >
              Answer All RP
            </button>

            <button
              onClick={() => {
                const answers = flattened.reduce((acc, { key, question }) => {
                  const [pill, weight] = key.split('_');
                  const score = WEIGHTS[weight];

                  return {
                    rp: {
                      ...acc.rp,
                      ...(pill === 'RP' ? { [question]: score * -1 } : {}),
                    },
                    bp: {
                      ...acc.bp,
                      ...(pill === 'BP' ? { [question]: score } : {}),
                    },
                  };
                }, {});
                updateRpScore(answers.rp);
                updateBpScore(answers.bp);
              }}
            >
              Answer All BP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

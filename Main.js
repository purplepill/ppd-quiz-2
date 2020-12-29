import React from 'react';
import styles from './styles/Home.module.css';
import questions from './questions.json';
import { useEffect, useState } from 'react';
import AdminPanel from './Admin';

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
    <div className={styles.scoreTable}>
      <div>
        <h2>Your results</h2>
        <div>Reality Score: {reality.toFixed(2)}</div>
        <div>Morality Score: {morality.toFixed(2)}</div>
        <div>Overall score: {(reality + morality).toFixed(2)}</div>
        {/* <div>Percent RP: {percent.toFixed(0)}%</div> */}
        <button
          className='mt-2'
          onClick={() => {
            onClearAnswers();
          }}
        >
          CLEAR ANSWERS
        </button>
      </div>
    </div>
  );
};

const ScoreGraph = ({ reality, morality }) => {
  const halfAxis = flattened.length / 2;
  const realityOffset = (reality + halfAxis) / flattened.length;
  const moralityOffset = (morality + halfAxis) / flattened.length;

  return (
    <div className={styles.scoreGraph}>
      {[...new Array(51 * 51)].map((_, i) => (
        <div className={styles.cell} key={i}></div>
      ))}
      <div className={styles.quad1} />
      <div className={styles.quad2} />
      <div className={styles.quad3} />
      <div className={styles.quad4} />
      <div
        className={styles.score}
        style={{
          '--reality-score': realityOffset,
          '--morality-score': moralityOffset,
        }}
      />
    </div>
  );
};

export default function Home({ admin, edit }) {
  const [rpScore, updateRpScore] = useState({});
  const [bpScore, updateBpScore] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const scores = JSON.parse(localStorage.getItem('answers'));
      updateRpScore(scores.rpScore);
      updateBpScore(scores.bpScore);
    } catch {}
    setLoaded(true);
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

  if (!loaded) {
    return <></>;
  }

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

  // Deprecated for now
  // const percent = ((reality + morality + 51) / 102) * 100;

  const currentRpPoints = Object.keys(rpScore).length;
  const currentBpPoints = Object.keys(bpScore).length;

  const finishedQuiz = currentRpPoints + currentBpPoints === flattened.length;

  const showResults = admin || finishedQuiz;
  const showQuestions = admin || edit || !finishedQuiz;
  const showEditLink = showResults && !edit;

  return (
    <div
      className={`${styles.container} ${
        !showQuestions ? styles.quizCompleted : ''
      }`}
    >
      <div className={styles.questionPanel}>
        <h2>PPD Red Pill / Blue Pill Ideology Quiz</h2>
        <div className={styles.intro}>
          This quiz is designed to determine your beliefs about The Red Pill
          ideology or lack there of. It test both how you believe things to be,
          and how you believe things should be. If questions are ambiguous as to
          whether they are about you personally or are universal statements,
          answer how you best see fit.
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
      <div className={styles.scoreCard}>
        <div>
          {showResults && (
            <ScoreTable
              {...{
                morality,
                reality,
              }}
              onClearAnswers={() => {
                updateBpScore({});
                updateRpScore({});
              }}
            />
          )}
          {!showResults && <>Complete all questions to see results.</>}
          {admin && (
            <AdminPanel
              className={styles.adminPanel}
              {...{
                updateBpScore,
                updateRpScore,
                rpScore,
                bpScore,
                WEIGHTS,
                flattened,
              }}
            />
          )}
        </div>
      </div>
      <div className={styles.scoreGraphContainer}>
        {showResults && (
          <ScoreGraph
            {...{
              morality,
              reality,
            }}
          />
        )}
      </div>
      <div className={styles.links}>
        {showEditLink && (
          <div>
            <a href='/edit'>Edit Results</a>
          </div>
        )}
        {edit && (
          <div>
            <a href='/'>View Results</a>
          </div>
        )}
      </div>
    </div>
  );
}

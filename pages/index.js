import Head from 'next/head';
import styles from '../styles/Home.module.css';
import questions from '../questions.json';
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

const toOverallScore = (rpScore, bpScore) => {
  const rp = toScore(rpScore);
  const bp = toScore(bpScore);
  const total = rp - bp + TOTAL_BP_POINTS;
  const percent = total / (TOTAL_RP_POINTS + TOTAL_BP_POINTS) * 100;
  return percent.toFixed(0);
};

export default function Home() {
  const [rpScore, updateRpScore] = useState({});
  const [bpScore, updateBpScore] = useState({});

  useEffect(() => {
    try {
      const scores = JSON.parse(localStorage.getItem('answers'));
      updateRpScore(scores.rpScore);
      updateBpScore(scores.bpScore);
    } catch {}

      try {
        const scores = JSON.parse(localStorage.getItem('score'));
        const newRpScore = Object.keys(scores.rpScore || {}).reduce((acc, key) => ({
          ...acc,
          [flattened[key].question]: scores.rpScore[key],
        }), {});
        const newBpScore = Object.keys(scores.bpScore || {}).reduce((acc, key) => ({
          ...acc,
          [flattened[key].question]: scores.bpScore[key],
        }), {});
        updateRpScore(newRpScore);
        updateBpScore(newBpScore);
        localStorage.removeItem('score');
      } catch {}
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
    if (!map.hasOwnProperty(ind)) {
      return false;
    }
    const score = WEIGHTS[moralityOrReality] * answeredValue;
    return map[ind] === score;
  };

  return (
    <div className={styles.container}>
      <div>
        {flattened.map(({ key, question }, ind) => (
          <div>
            {/* <h3>{key}</h3> */}
            <>
              <div>
                <h4>
                  {ind + 1}: {question}
                </h4>
                <input
                  name={question}
                  id={`${ind}_stronglyAgree`}
                  type='radio'
                  value='stronglyAgree'
                  onChange={answer(question, key, ANSWERS.stronglyAgree)}
                  checked={checked(question, key, ANSWERS.stronglyAgree)}
                />
                <label htmlFor={`${ind}_stronglyAgree`}>Strongly Agree</label>
                <input
                  name={question}
                  id={`${ind}_agree`}
                  type='radio'
                  value='agree'
                  onChange={answer(question, key, ANSWERS.agree)}
                  checked={checked(question, key, ANSWERS.agree)}
                />
                <label htmlFor={`${ind}_agree`}>Agree</label>
                <input
                  name={question}
                  id={`${ind}_neutral`}
                  type='radio'
                  value='neutral'
                  onChange={answer(question, key, ANSWERS.neutral)}
                  checked={checked(question, key, ANSWERS.neutral)}
                />
                <label htmlFor={`${ind}_neutral`}>Neutral</label>
                <input
                  name={question}
                  id={`${ind}_disagree`}
                  type='radio'
                  value='disagree'
                  onChange={answer(question, key, ANSWERS.disagree)}
                  checked={checked(question, key, ANSWERS.disagree)}
                />
                <label htmlFor={`${ind}_disagree`}>Disagree</label>
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
            </>
          </div>
        ))}
      </div>
      <div>
        <div>RP Score: {toScore(rpScore).toFixed(2)}</div>
        <div>BP Score: {toScore(bpScore).toFixed(2)}</div>
        <div>Overall RPness {toOverallScore(rpScore, bpScore)}%</div>
        <button
          onClick={() => {
            updateBpScore({});
            updateRpScore({});
          }}
        >
          CLEAR ANSWERS
        </button>
      </div>
    </div>
  );
}

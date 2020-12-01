import React from 'react';

export default function AdminPanel({
  className = '',
  updateBpScore,
  updateRpScore,
  rpScore,
  bpScore,
  WEIGHTS,
  flattened,
}) {
  return (
    <div className={className}>
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

      <button
        onClick={() => {
          const answers = flattened.reduce(
            (acc, { key, question }) => {
              const [pill, weight] = key.split('_');
              const score = WEIGHTS[weight];

              return {
                ...acc,
                rp: {
                  ...acc.rp,
                  ...(pill === 'RP' && weight === 'MORALITY'
                    ? { [question]: score }
                    : {}),
                },
              };
            },
            {
              rp: rpScore,
              bp: bpScore,
            }
          );
          updateRpScore(answers.rp);
          updateBpScore(answers.bp);
        }}
      >
        Answer All RP Morality
      </button>

      <button
        onClick={() => {
          const answers = flattened.reduce(
            (acc, { key, question }) => {
              const [pill, weight] = key.split('_');
              const score = WEIGHTS[weight];

              return {
                ...acc,
                bp: {
                  ...acc.bp,
                  ...(pill === 'BP' && weight === 'MORALITY'
                    ? { [question]: score }
                    : {}),
                },
              };
            },
            {
              rp: rpScore,
              bp: bpScore,
            }
          );
          updateRpScore(answers.rp);
          updateBpScore(answers.bp);
        }}
      >
        Answer All BP Morality
      </button>

      <button
        onClick={() => {
          const answers = flattened.reduce(
            (acc, { key, question }) => {
              const [pill, weight] = key.split('_');
              const score = WEIGHTS[weight];

              return {
                ...acc,
                rp: {
                  ...acc.rp,
                  ...(pill === 'RP' && weight === 'REALITY'
                    ? { [question]: score }
                    : {}),
                },
              };
            },
            {
              rp: rpScore,
              bp: bpScore,
            }
          );
          updateRpScore(answers.rp);
          updateBpScore(answers.bp);
        }}
      >
        Answer All RP Reality
      </button>

      <button
        onClick={() => {
          const answers = flattened.reduce(
            (acc, { key, question }) => {
              const [pill, weight] = key.split('_');
              const score = WEIGHTS[weight];

              return {
                ...acc,
                bp: {
                  ...acc.bp,
                  ...(pill === 'BP' && weight === 'REALITY'
                    ? { [question]: score }
                    : {}),
                },
              };
            },
            {
              rp: rpScore,
              bp: bpScore,
            }
          );
          updateRpScore(answers.rp);
          updateBpScore(answers.bp);
        }}
      >
        Answer All BP Reality
      </button>
    </div>
  );
}

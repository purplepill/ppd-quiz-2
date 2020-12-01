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

      {/* START: STRONGLY AGREE REALITY / MORALITY / BOTH */}

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
        Stongly Agree All RP Morality
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
        Stongly Agree All BP Morality
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
        Stongly Agree All RP Reality
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
        Stongly Agree All BP Reality
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
                  ...(pill === 'RP' && weight === 'BOTH'
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
        Stongly Agree All RP Both
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
                  ...(pill === 'BP' && weight === 'BOTH'
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
        Stongly Agree All BP Both
      </button>

      {/* START: STRONGLY DISAGREE REALITY / MORALITY / BOTH */}

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
                    ? { [question]: score * -1 }
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
        Stongly Disagree All RP Morality
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
                    ? { [question]: score * -1 }
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
        Stongly Disagree All BP Morality
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
                    ? { [question]: score * -1 }
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
        Stongly Disagree All RP Reality
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
                    ? { [question]: score * -1 }
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
        Stongly Disagree All BP Reality
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
                  ...(pill === 'RP' && weight === 'BOTH'
                    ? { [question]: score * -1 }
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
        Stongly Disagree All RP Both
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
                  ...(pill === 'BP' && weight === 'BOTH'
                    ? { [question]: score * -1 }
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
        Stongly Disagree All BP Both
      </button>
    </div>
  );
}

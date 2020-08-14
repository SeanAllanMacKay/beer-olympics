import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import { ScreenProvider } from '@contexts/ScreenContext';

import Header from '@components/Header';

import Form from '@components/Form';
import Field from '@components/Field';

import { Button, Input, Select } from 'antd';

const { Option } = Select;

import emojiFlags from 'emoji-flags';

import ReactCountryFlag from 'react-country-flag';

import 'antd/dist/antd.css';

import Routes from '@routes';

const required = (value) => (value ? undefined : 'Required');

export default () => {
  const history = useHistory();
  const [teams, setTeams] = useState([]);
  const [taken, setTaken] = useState([]);

  const addTeam = async (body) => {
    const { playerOne, country } = body;

    if (playerOne && country) {
      const response = await fetch(`/api/teams`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const { docs } = await response.json();

      await fetchTeams();
    }
  };

  const addPlayer = async (body) => {
    const { playerTwo } = body;

    if (playerTwo) {
      const response = await fetch(`/api/teams`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const { docs } = await response.json();

      const newDocs = teams.slice(
        teams.indexOf(teams.find(({ _id }) => _id === docs._id)),
        1,
        docs
      );

      await fetchTeams();
    }
  };

  const changePoints = async (body) => {
    console.log(body);
    const response = await fetch(`/api/teams`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    await fetchTeams();
  };

  const deleteTeam = async () => {};

  const fetchTeams = async () => {
    try {
      const response = await fetch(`/api/teams`);

      if (response.ok) {
        const { docs } = await response.json();
        setTeams(docs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchTeams();
    })();
  }, []);

  useEffect(() => {
    setTaken(teams.map(({ country }) => country));
  }, [teams]);

  return (
    <ScreenProvider>
      <Header />
      <div style={{ height: 'calc(100vh - 54px)', display: 'flex' }}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '450px',
                      backgroundColor: '#E0E0E0',
                      padding: '13px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        overflow: 'auto',
                      }}
                    >
                      {teams.map(
                        ({ country, playerOne, playerTwo, _id, points }) => (
                          <div
                            style={{
                              width: '100%',
                              backgroundColor: 'whitesmoke',
                              borderRadius: '5px',
                              padding: '10px',
                              margin: '0 0 10px 0',
                              display: 'flex',
                              flexDirection: 'row',
                              position: 'relative',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 5,
                                  right: 5,
                                }}
                              >
                                <Button type="link">x</Button>
                              </div>
                              <p
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <span style={{ fontWeight: 'bold' }}>
                                  Country:{' '}
                                </span>
                                {emojiFlags.countryCode(country).name}

                                <div
                                  style={{
                                    margin: '0 0 0 10px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                >
                                  <ReactCountryFlag countryCode={country} svg />
                                </div>
                              </p>

                              <p>
                                <span style={{ fontWeight: 'bold' }}>
                                  Player 1:{' '}
                                </span>
                                {playerOne}
                              </p>
                              {playerTwo ? (
                                <p>
                                  <span style={{ fontWeight: 'bold' }}>
                                    Player 2:{' '}
                                  </span>{' '}
                                  {playerTwo}
                                </p>
                              ) : (
                                <Form
                                  onSubmit={addPlayer}
                                  initialValues={{ _id }}
                                >
                                  <div
                                    style={{
                                      width: '100%',
                                      backgroundColor: 'whitesmoke',
                                      borderRadius: '5px',
                                      padding: '10px',
                                    }}
                                  >
                                    <Field title="Player 2" name="playerTwo">
                                      {({
                                        name,
                                        onBlur,
                                        onChange,
                                        onFocus,
                                        value,
                                      }) => <Input onChange={onChange} />}
                                    </Field>

                                    <Button
                                      htmlType="submit"
                                      type="primary"
                                      style={{ width: '100%' }}
                                    >
                                      Add Player
                                    </Button>
                                  </div>
                                </Form>
                              )}
                            </div>

                            <div>
                              <h1 style={{ textAlign: 'center' }}>{points}</h1>
                              <Button
                                onClick={() =>
                                  changePoints({ points: points - 1, _id })
                                }
                              >
                                -1
                              </Button>
                              <Button
                                onClick={() =>
                                  changePoints({ points: points + 1, _id })
                                }
                              >
                                +1
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <Form onSubmit={addTeam}>
                      <div
                        style={{
                          width: '100%',
                          backgroundColor: 'whitesmoke',
                          borderRadius: '5px',
                          padding: '10px',
                          margin: '20px 0 0 0',
                        }}
                      >
                        <Field
                          title="Country"
                          name="country"
                          validate={required}
                        >
                          {({ name, onBlur, onChange, onFocus, value }) => (
                            <Select
                              style={{ width: '100%' }}
                              onChange={onChange}
                            >
                              {emojiFlags.data
                                .filter(({ code }) => !taken.includes(code))
                                .map(({ code, name, emoji }, index) => (
                                  <Option value={code} key={`${code}-${index}`}>
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <div
                                        style={{
                                          margin: '0 10px 0 0',
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <ReactCountryFlag
                                          countryCode={code}
                                          svg
                                        />
                                      </div>

                                      {name}
                                    </div>
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Field>

                        <Field
                          title="Player 1"
                          name="playerOne"
                          validate={required}
                        >
                          {({ name, onBlur, onChange, onFocus, value }) => (
                            <Input onChange={onChange} />
                          )}
                        </Field>

                        <Field title="Player 2" name="playerTwo">
                          {({ name, onBlur, onChange, onFocus, value }) => (
                            <Input onChange={onChange} />
                          )}
                        </Field>

                        <Button
                          htmlType="submit"
                          type="primary"
                          style={{ width: '100%' }}
                        >
                          Add Team
                        </Button>
                      </div>
                    </Form>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'whitesmoke',
                      flex: 1,
                    }}
                  ></div>
                </div>
              );
            }}
          />

          {Object.entries(Routes).map(([path, page]) => (
            <Route key={path} exact path={`/${path}`} render={page} />
          ))}
        </Switch>
      </div>
    </ScreenProvider>
  );
};

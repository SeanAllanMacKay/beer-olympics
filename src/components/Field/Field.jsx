import React from 'react';
import { Field } from 'react-final-form';

export default ({ title, name, placeholder, children, validate }) => (
  <div style={{ margin: '0 0 10px 0' }}>
    <p style={{ margin: '0 0 3px 0' }}>{title}</p>

    <Field name={name} validate={validate} subscription={{ value: true }}>
      {({
        input: { name, onBlur, onChange, onFocus, value },
        meta: { touched, error },
      }) => (
        <>
          {children({
            name,
            onBlur,
            onChange,
            onFocus,
            value,
            error,
            labelledBy: `${name}`,
          })}
          <div>
            {touched && error && (
              <span style={{ color: 'darkred' }}>{error}</span>
            )}
          </div>
        </>
      )}
    </Field>
  </div>
);

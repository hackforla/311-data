import React from 'react';

const url = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE}`;

const useContentful = query => {
  const [data, setData] = React.useState(null);
  const [errors, setErrors] = React.useState(null);

  React.useEffect(() => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    })
    .then(response => response.json())
    .then(({ resData, resErrors }) => {
      if (resErrors) setErrors(resErrors);
      if (resData) setData(resData);
    })
    .catch(error => setErrors([error]));
  }, [query]);

  return { data, errors };
};

export default useContentful;

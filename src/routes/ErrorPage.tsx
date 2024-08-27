import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();

  // Log the error to the console
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/">Home</Link>
    </div>
  );
}

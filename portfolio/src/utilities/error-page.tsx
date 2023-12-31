import { Link } from "react-router-dom";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  let errorMessage: string | any;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    if(isRouteErrorResponse(error)) {
      errorMessage = error.data.message;
    } else {
      errorMessage = error;
    }
    //errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <>
      <div className="bg"></div>
      <main className="app" id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{errorMessage}</i>
        </p>
        <Link to="/">Return Home</Link>
      </main>
    </>
  );
}

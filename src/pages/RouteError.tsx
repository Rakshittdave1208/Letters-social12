import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();

  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    message = error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-2xl font-semibold">Oops 😵</h1>

      <p className="text-gray-500">{message}</p>

      <Link
        to="/"
        className="px-4 py-2 bg-black text-white rounded-md"
      >
        Go back home
      </Link>
    </div>
  );
}
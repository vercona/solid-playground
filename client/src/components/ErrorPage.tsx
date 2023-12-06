import { useSearchParams } from "@solidjs/router";

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
    console.log("searchParams", searchParams)
    return (
      <div class="flex flex-col justify-center items-center h-screen">
        <div class="text-7xl">{searchParams.statusCode}</div>
        <div>{atob(searchParams.message)}</div>
      </div>
    );
};

export default ErrorPage;

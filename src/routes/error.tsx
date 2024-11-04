import { Button } from "#/ui/button";
import { HomeIcon } from "lucide-react";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorRoute() {
  const error = useRouteError();

  return (
    <div className="size-full flex flex-col gap-20 mt-10 ml-5 items-center">
      <div className="self-center justify-center flex flex-col gap-10">
        <span className="text-4xl font-bold">An error occurred</span>

        <img
          src="/whoops.webp"
          alt="Whoops"
          width={300}
          height={150}
          className="rounded-md overflow-hidden"
        />

        <GoBackHome />
      </div>

      <div>
        <span className="font-medium text-2xl text-destructive border-dashed border-muted-foreground p-2 border-2 rounded-md">
          {error instanceof Error ? error.message : "Unknown error"}
        </span>
      </div>
    </div>
  );
}

function GoBackHome() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Button variant="default" className="text-2xl h-10" onClick={handleClick}>
      <HomeIcon className="!size-5" />

      <span>Go back home</span>
    </Button>
  );
}

type Auth2ProviderProps = {};

const Auth2Provider = ({}: Auth2ProviderProps) => {
  const handleGitHubLogin = () => {
    alert("Stay tuned, coming soon!");
  };

  const handleGoogleLogin = () => {
    alert("Stay tuned, coming soon!");
  };

  return (
    <>
      <div className="flex items-center gap-2 my-3">
        <hr className="flex-grow border-t-1 border-gray-300" />
        <span className="text-gray-300">OR</span>
        <hr className="flex-grow border-t-1 border-gray-300" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="flex justify-center items-center gap-2 py-2 rounded border border-gray-600 hover:backdrop-brightness-400"
        >
          <i className="fab fa-github text-xl"></i>
          <span>Continue with GitHub</span>
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex justify-center items-center gap-2 py-2 rounded border border-gray-600 hover:backdrop-brightness-400"
        >
          <i className="fab fa-google text-xl"></i>
          <span>Continue with Google</span>
        </button>
      </div>
    </>
  );
};

export default Auth2Provider;

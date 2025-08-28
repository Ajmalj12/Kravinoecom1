import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Login = () => {
  const { setToken, navigate, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (currentState === "Sign Up") {
        const res = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          navigate("/");
        } else {
          setError(res.data.message || "Signup failed");
        }
      } else {
        const res = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          navigate("/");
        } else {
          setError(res.data.message || "Invalid email or password");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      {error && (
        <div className="w-full text-red-600 text-sm -mt-2">{error}</div>
      )}

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {currentState === "Login" ? (
          <p
            onClick={() => {
              setCurrentState("Sign Up");
              setError("");
            }}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => {
              setCurrentState("Login");
              setError("");
            }}
            className="cursor-pointer"
          >
            Login Here{" "}
          </p>
        )}
      </div>

      <button disabled={loading} className="bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-60">
        {loading ? (currentState === "Login" ? "Signing In..." : "Signing Up...") : (currentState === "Login" ? "Sign In" : "Sign Up")}
      </button>
    </form>
  );
};

export default Login;

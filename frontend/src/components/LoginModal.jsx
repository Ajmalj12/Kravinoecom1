import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { setToken, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
          onLoginSuccess();
          onClose();
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          onLoginSuccess();
          onClose();
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="prata-regular text-2xl">{currentState}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {currentState === "Sign Up" && (
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

          <div className="w-full flex justify-between text-sm mt-1">
            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="cursor-pointer"
              >
                Create account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer"
              >
                Login Here
              </p>
            )}
          </div>

          <button className="bg-black text-white font-light px-8 py-2 mt-2">
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
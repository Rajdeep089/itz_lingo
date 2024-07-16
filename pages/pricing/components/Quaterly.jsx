import React, { useState, useEffect } from "react";
import { baseUrl } from "@/config/index";
import axios from "axios";

const Quarterly = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/v1/payment/plan?duration=quarterly`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(response.data.plans);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // console.log(data);

  const handleBuyNow = async (planId, amount) => {
    if (isPaymentInProgress) return; // Prevent multiple clicks
  
    try {
      setIsPaymentInProgress(true);
  
      const orderResponse = await axios.post(
        `${baseUrl}/v1/payment`,
        {
          amount: amount,
          planId: planId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      const { orderId } = orderResponse.data.data;
  
      const options = {
        key: "rzp_test_5ureH41rm3YjF3",
        amount: amount * 100,
        currency: "INR",
        name: "Itz Lingo",
        description: "Purchase Description",
        order_id: orderId,
        handler: function (response) {
          alert(
            "Payment successful. Payment ID: " + response.razorpay_payment_id
          );
          // Handle successful payment (e.g., update user subscription status)
        },
        prefill: {
          name: localStorage.getItem("name") || "",
          email: localStorage.getItem("email") || "",
          contact: localStorage.getItem("contact") || "",
        },
        theme: {
          color: "#081F5C",
        },
        modal: {
          ondismiss: function() {
            setIsPaymentInProgress(false);
          }
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
      setIsPaymentInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#081F5C]"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-row justify-center gap-5 px-5 md:my-5 my-3 h-[60vh] absolute bottom-0">
      {data.reverse().map((item, index) => (
        <div
          key={index}
          className="w-1/3 flex items-center flex-col md:justify-end justify-center"
        >
          <div className="group md:p-5 p-1 w-full h-2/3 flex flex-col justify-between transition-all duration-500 md:hover:h-full hover:h-[75%] hover:scale-105 border border-gray-400 hover:bg-[#081F5C] rounded-lg text-[#081F5C] overflow-hidden">
            <div className="flex flex-col justify-between h-full transition-all duration-300 group-hover:justify-center">
              <h1 className="md:text-2xl text-lg my-1 group-hover:my-8 font-semibold group-hover:text-white group-hover:font-bold transition-all duration-300 ease-in-out">
                {item.type.toUpperCase()}
              </h1>
              <div className="space-x-3 my-2 md:group-hover:my-6 transition-all duration-300 ease-in-out">
                <strike className="md:text-xl text-gray-500">
                  {item.amount}
                </strike>{" "}
                <span className="md:text-3xl text-xl font-semibold group-hover:font-bold group-hover:text-white">
                  {item.discountAmount}
                </span>
              </div>
              {item.features.map((feature, index) => (
                <div
                  key={index}
                  className="text-xl my-0 flex items-center gap-2 group-hover:my-2 transition-all duration-300 ease-in-out"
                >
                  <span className="group-hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="md:size-5 size-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg>
                  </span>
                  <span className="group-hover:text-white md:text-base text-xs">
                    {feature}
                  </span>
                </div>
              ))}
              <button
                onClick={() => handleBuyNow(item.id, item.discountAmount)}
                disabled={isPaymentInProgress}
                className={`btn md:btn-sm btn-xs md:text-sm text-[11px] bg-[#081F5C] text-white group-hover:bg-white group-hover:text-[#081F5C] hover:scale-105 w-[70%] mx-auto transition-all duration-300 ease-in-out transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
                  isPaymentInProgress ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isPaymentInProgress ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Quarterly;

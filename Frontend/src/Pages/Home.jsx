import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../Components/core/HomePage/HighlightText";
import CTAButton from "../Components/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlock from "../Components/core/HomePage/CodeBlock";

function Home() {
  return (
    <div>
      {/* Section 1 */}

      <div className="relative mx-auto flex flex-col max-w-maxContent w-11/12 items-center text-white justify-between">
        <Link to="/signup">
          <div className="group mt-16 p-2 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit ">
            <div className="flex flex-row items-center gap-2 rounded-full px-8 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an instructor</p>
              <FaLongArrowAltRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>
        <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300 ">
          Learn to code with our expert instructors and get hired by top
          companies.
        </div>

        <div className="flex flex-row gap-7 mt-8 ">
          <CTAButton active={true} linkto={"/signup"}>
            learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className=" mx-3 my-12  shadow-blue-200">
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code sec-1 */}

        <div>
          <CodeBlock
            position={`lg:flex-row`}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your <HighlightText text={"Coding Potential"} /> with Our
                Online Courses
              </div>
            }
            subHeading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctaBtn1={{
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctaBtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            CodeBlock={`<!DOCTYPE html>\n <head>\n <title>Compu-Tech</title>\n</head>\n<body>\n <div>\n  Hello Wrold !!\n </div>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
          />
        </div>

        {/* code sec-2 */}
        <div>
          <CodeBlock
            position={`lg:flex-row-reverse`}
            heading={
              <div className="text-4xl font-semibold">
                Start <HighlightText text={"Coding In Seconds"} />
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctaBtn1={{
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctaBtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            CodeBlock={`<!DOCTYPE html>\n <head>\n <title>Compu-Tech</title>\n</head>\n<body>\n <div>\n  Hello Wrold !!\n </div>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
          />
        </div>
      </div>

      {/* Section 2 */}
      {/* Section 3 */}
      {/* Section 4 */}
      {/* Footer */}
    </div>
  );
}

export default Home;

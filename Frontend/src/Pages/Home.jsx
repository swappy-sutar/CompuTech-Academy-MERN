import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../Components/core/HomePage/HighlightText";
import CTAButton from "../Components/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlock from "../Components/core/HomePage/CodeBlock";
import LearningLanguageSection from "../Components/core/HomePage/LearningLanguageSection";
import TimelineSection from "../Components/core/HomePage/TimelineSection";
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
            codeColor={"text-blue-25"}
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700 ">
        <div className="homepage_bg h-[310px] ">
          <div className="w-11/12 flex-col max-w-maxContent flex justify-center items-center gap-5 mx-auto ">
            <div className="h-[150px] "></div>

            <div className="flex flex-row gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex gap-2 items-center">
                  Explore Full Catelog
                  <FaLongArrowAltRight />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className="flex flex-row gap-5 mb-10 mt-[95px]">
            <div className="text-4xl font-semibold w-[45%]">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>

          <TimelineSection />

          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      {/* Section 4 */}
      {/* Footer */}
    </div>
  );
}

export default Home;

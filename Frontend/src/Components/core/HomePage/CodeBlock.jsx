import React from "react";
import CTAButton from "./CTAButton";
import HighlightText from "./HighlightText";
import { FaLongArrowAltRight } from "react-icons/fa";
import {TypeAnimation} from "react-type-animation"
function CodeBlock({
  position,
  heading,
  subHeading,
  ctaBtn1,
  ctaBtn2,
  CodeBlock,
  backgroundGradient,
  codeColor,
}) {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
      {/* sec-1 */}
      <div className="w-[50%] flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-bold ">{subHeading}</div>

        <div className="flex gap-7 mt-7">
          <CTAButton active={ctaBtn1.active} linkto={ctaBtn1.linkto}>
            <div className="flex gap-5 items-center">
              {ctaBtn1.btnText}
              <FaLongArrowAltRight />
            </div>
          </CTAButton>

          <CTAButton active={ctaBtn2.active} linkto={ctaBtn2.linkto}>
            {ctaBtn2.btnText}
          </CTAButton>
        </div>
      </div>
      {/* sec-2 */}

      <div className="h-fit  flex flex-row text-10[px] w-[100%] py-4 lg:w-[500px] ">
        {/* HW: bg gradient*/}
        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
        </div>

        <div
          className={`w-[90%] flex-col gap-2 font-bold font-mono ${codeColor} pr-2 `}
        >
          <TypeAnimation
            sequence={[CodeBlock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeBlock;

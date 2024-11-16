import React from 'react'
import HighlightText from './HighlightText'
import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../assets/Images/Compare_with_others.png";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from './CTAButton';



function LearningLanguageSection() {
  return (
    <div className="mt-[130px] mb-20 ">
      <div className="flex flex-col gap-5 items-center">
        <div className="text-4xl font-semibold text-center ">
          Your Swiss Knife For
          <HighlightText text={"learning any lanuage"} />
        </div>

        <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[70%]">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className="flex flex-row items-center justify-center mt-5">
          <img
            src={Know_your_progress}
            className="object-contain -mr-28 "
            alt="Know_your_progress"
          />
          <img
            src={Compare_with_others}
            className="object-contain  "
            alt="Compare_with_others"
          />
          <img
            src={Plan_your_lessons}
            className="object-contain -ml-32"
            alt="Plan_your_lessons"
          />
        </div>
        <div>
          <CTAButton active={true} linkto={"/signup"}>
            <div>Learn more</div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

export default LearningLanguageSection

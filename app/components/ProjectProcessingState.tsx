import LoadingSvg from "../SvgComps/loading";

export const ProjectProcessingState = () => (
  <div className="w-full h-full bg-slate-300/10 absolute top-[-16px] left-[0px] z-20 flex justify-center items-center">
    <div className="w-[400px] p-[16px] bg-gray-900 rounded-md text-white flex flex-col items-center text-center gap-[4px]">
      <LoadingSvg />
      <span className="font-bold text-[18px]">Setting up your project</span>
      <span>It may take few minutes to setup your project</span>
    </div>
  </div>
);

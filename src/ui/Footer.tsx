import { HeaderLogo } from "./Header";

export function Footer() {
  return (
    <div class="bg-[#1761ff] h-[500px] w-full p-5 overflow-hidden">
      <div class="relative overflow-visible">
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "0",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            "clip-path": "ellipse(max(40%, 700px) 50% at 50% 50%)",
            width: "140%",
            height: "200px",
            "z-index": "1",
          }}
        ></div>

        <div class="relative z-[100] pt-[210px]">
          <div class="w-full max-w-[960px] mx-auto flex flex-col text-center flex flex-col items-center">
            <span class="text-white text-5xl font-bold">Stay in the loop</span>
            <span class="text-white/50 text-md font-medium">
              We regularly post about our based house, workshops & events.
            </span>
            <a
              class="outline-none px-5 py-3 mt-5 bg-white text-blue-500 font-bold rounded-full cursor-pointer transition-all border-[#1761ff] border-2 hover:bg-blue-50"
              href="https://x.com/homebasedotlove"
              target="_blank "
            >
              Follow @homebasedotlove
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { setCharacters } from "@/stores/hanziStore";

export const Route = createFileRoute("/custom")({
	component: function CustomPage() {
		const navigate = useNavigate();
		const [input, setInput] = useState("");

		const hanziChars = input
			.split("")
			.filter((char) => /[\u4e00-\u9fa5]/.test(char));

		const handleSubmit = () => {
			if (hanziChars.length > 0) {
				setCharacters(hanziChars);
				navigate({ to: "/" });
			}
		};

		return (
			<div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 p-4">
				<div className="max-w-md mx-auto">
					<button
						type="button"
						onClick={() => navigate({ to: "/" })}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
					>
						<ArrowLeft className="w-5 h-5" />
						返回
					</button>

					<div className="bg-white rounded-3xl shadow-lg p-6">
						<h1 className="text-2xl font-bold text-gray-800 mb-4">
							自定义汉字
						</h1>

						<p className="text-gray-600 mb-4">
							在下方输入你想学习的汉字，自动识别并生成练习卡片
						</p>

						<div className="space-y-4">
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="请输入汉字，例如：我爱学习汉字"
								className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none resize-none text-lg"
							/>

							{hanziChars.length > 0 && (
								<div className="p-4 bg-emerald-50 rounded-2xl">
									<div className="flex items-center justify-between mb-3">
										<p className="text-sm font-medium text-emerald-700">
											识别到 {hanziChars.length} 个汉字
										</p>
									</div>
									<div className="flex flex-wrap gap-2">
										{hanziChars.map((char, index) => (
											<span
												key={`${char}-${index}`}
												className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-xl text-lg font-semibold shadow-md"
											>
												{char}
											</span>
										))}
									</div>
								</div>
							)}

							<button
								type="button"
								onClick={handleSubmit}
								disabled={hanziChars.length === 0}
								className="w-full px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors shadow-lg"
							>
								{hanziChars.length === 0
									? "请输入汉字"
									: `开始学习 ${hanziChars.length} 个汉字`}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	},
});

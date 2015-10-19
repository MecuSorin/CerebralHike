using Params;

namespace ExtractThumbnail
{
	public class CommandLineParamsOptions
	{
		const int defaultOutputHeight = 128;
		const int defaultTimeFrameInSeconds = 1;

		public CommandLineParamsOptions()
		{
			this.TimeFrameInSeconds = 1;
			this.HeightOfTheOutputInPixels = defaultOutputHeight;
		}

		[Param(Name = 's', FullName = "Source", Required = true, Description = "Source file or folder containing *.mp4 video files")]
		public string Source { get; set; }

		[Param(Name = 't', FullName = "TimeFrameInSeconds", Required = false, DefaultValue = defaultTimeFrameInSeconds, Description = "Timeframe from witch to extract the thumbnail")]
		public int TimeFrameInSeconds { get; set; }

		[Param(Name = 'h', FullName = "HeightOfProcessedOutput", Required = false, DefaultValue = defaultOutputHeight, Description = "Height of the processed output image")]
		public int HeightOfTheOutputInPixels { get; set; }
	}
}

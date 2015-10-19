using AForge.Imaging.Filters;
using MediaToolkit;
using MediaToolkit.Model;
using MediaToolkit.Options;
using Params;
using System;
using System.Collections.Generic;
using System.IO;
using System.Drawing;

namespace ExtractThumbnail
{
	class Program
	{

		static void Main(string[] args)
		{
			var paramsControl = new ParamsControl<CommandLineParamsOptions>(new CommandLineParamsOptions(), args, "Thumbnail extractor");
			var valid = paramsControl.Validate();
			if (valid == false)
			{
				Console.WriteLine(paramsControl.GenerateError());
				return;
			}
			FileAttributes sourceAttributes = FileAttributes.Normal;
			try
			{
				sourceAttributes = File.GetAttributes(paramsControl.Values.Source);
			}
			catch(Exception ex)
			{
				Console.WriteLine("Failed to get the file: " + ex.ToString());
				return;
			}
			IEnumerable<string> videosToProcess = null;
			if(sourceAttributes.HasFlag(FileAttributes.Directory))
			{
				videosToProcess = Directory.GetFiles(paramsControl.Values.Source, "*m.mp4", SearchOption.AllDirectories);
			}
			else
			{
				videosToProcess = new string [] { paramsControl.Values.Source };
			}
			foreach(var videoPath in videosToProcess)
			{
				string rawOutFile = ExtractFrameToFile(paramsControl, videoPath);
				if (File.Exists(rawOutFile))
				{
					var outFile = GetThumbName(rawOutFile, "play_", ".jpg");
					Bitmap raw = new Bitmap(rawOutFile);
					raw.CropImage()
						.FilterEdge()
						//.ToBlackAndWhite()
						.Negative()
						.Resize(paramsControl.Values.HeightOfTheOutputInPixels)
						.AddPlayOverlay()
						.Save(outFile);
				}
			}

			Console.WriteLine("Done");
		}

		private static string ExtractFrameToFile(ParamsControl<CommandLineParamsOptions> paramsControl, string videoPath)
		{
			var rawOutFile = GetThumbName(videoPath, "thumb_", ".jpg");
			ExtractFrame(videoPath, paramsControl.Values.TimeFrameInSeconds, rawOutFile);
			return rawOutFile;
		}

		public static string GetThumbName(string filePath, string prefix, string extension) {
			var fileInfo = new FileInfo(filePath);
			return Path.Combine(fileInfo.DirectoryName, prefix + fileInfo.Name.Substring(0, fileInfo.Name.Length-4) + extension);
		}

		public static void ExtractFrame(string file, int momentFromStartInSeconds, string output)
		{
			var inputFile = new MediaFile { Filename = file };
			var outputFile = new MediaFile { Filename = output };

			using (var engine = new Engine())
			{
				engine.GetMetadata(inputFile);
				var options = new ConversionOptions { Seek = TimeSpan.FromSeconds(momentFromStartInSeconds) };
				try
				{
					engine.GetThumbnail(inputFile, outputFile, options);
				}
				catch(Exception ex)
				{
					Console.WriteLine("Failed to extract the image from: {0} because of {1}", inputFile, ex.ToString());
				}
			}
		}
	}

	public static class FilterExtensions
	{
		public static Bitmap FilterEdge(this Bitmap originalImage)
		{
			var sourceImage = Grayscale.CommonAlgorithms.RMY.Apply(originalImage);
			var filter = new SobelEdgeDetector();
			return filter.Apply(sourceImage);
		}

		public static Bitmap AddPlayOverlay(this Bitmap source)
		{
            var color = Color.FromArgb(7, 76, 95);
			const int borderWidth = 6;
			var output = new Bitmap(source);
			using (var gr = Graphics.FromImage(output))
			{
				var rectangle = new Rectangle(borderWidth, borderWidth, source.Width - 2*borderWidth, source.Height - 2*borderWidth);
				var pen = new Pen(color, 2* borderWidth);
				gr.DrawRectangle(pen, rectangle);
				return output;
			}
		}

		public static Bitmap Resize(this Bitmap source, int height)
		{
			var proportionalWidht = (double)(source.Width*height) / (double)source.Height;
			ResizeBilinear filter = new ResizeBilinear((int)Math.Round(proportionalWidht, 0), height);
			return filter.Apply(source);
		}

		public static Bitmap Negative(this Bitmap source)
		{
			var filter = new Invert();
			filter.ApplyInPlace(source);
			return source;
		}

		public static Bitmap ToBlackAndWhite(this Bitmap source) {
			Threshold filter = new Threshold(100);
			return filter.Apply(source);
		}

		public static Bitmap CropImage(this Bitmap source) {
			const int widthCrop = 80;
			const int heightCrop = 50;
			Crop filter = new Crop(new Rectangle(widthCrop, heightCrop, source.Width- 2* widthCrop -10, source.Height - 10 - 2 * heightCrop));
			return filter.Apply(source);
		}
	}
}

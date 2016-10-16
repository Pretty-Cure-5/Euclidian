using System;
using System.Threading;

namespace KinnectDataToHexAndXYZ
{
    public class Program
    {

        
        static void Main(string[] args)
        {
            Console.Title = "Bespaced data to xyz and hex, Argyll McGhie";
            Console.WriteLine(@"Author: Argyll McGhie

For Bespaced data to xyz and hex.
This formats the data and places it into json file format.
Removes all bloat, including zero and infinity.\n
Removes the UV
Reduces the decimal format from.^ 15 to.^ 3");
            
            while (true)
            {
                Console.Write("File Name:");
                string FileName = Console.ReadLine();

                if (FileName.Trim(' ') != "" && System.IO.File.Exists(FileName) )
                {
                    try
                    {
                        Data D = new Data(FileName);
                        break;
                    }
                    catch (SystemException)
                    {

                    }
                }

            }
            while (true)
            {
                Console.Clear();
                Console.WriteLine("Working.");
                Thread.Sleep(3000);
                Console.Clear();
                Console.WriteLine("Working..");
                Thread.Sleep(3000);
                Console.Clear();
                Console.WriteLine("Working...");
                Thread.Sleep(3000);
                Console.Clear();
                Console.WriteLine("Working....");

            }



        }

        

        
    }

}

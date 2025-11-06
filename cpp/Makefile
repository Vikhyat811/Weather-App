CXX = g++
CXXFLAGS = -std=c++17 -Ithird_party -lcurl

OBJS = main.o Weather.o

all: weather_app

weather_app: $(OBJS)
	$(CXX) $(OBJS) -o weather_app -lcurl

main.o: main.cpp Weather.hpp
	$(CXX) $(CXXFLAGS) -c main.cpp

Weather.o: Weather.cpp Weather.hpp
	$(CXX) $(CXXFLAGS) -c Weather.cpp

clean:
	rm -f *.o weather_app

# FlappyBirds AI using NEAT

Based on [CodeBullet's Video on YouTube](https://www.youtube.com/watch?v=WSW-5m8lRMs) this is a plain JavaScript implementation of FlappyBirds including self training neural network with NEAT ([neaterJs implementation](https://github.com/dangpg/neaterJS)).
Here is a link to the [Paper: Evolving Neural Networks through Augmenting Topologies](http://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf), which explains how the training algorithmn works.

The game is built with [P5js](https://p5js.org/).

It also features a visualization of neural network of the "best players" in each different species of the current generation and the overall best player across all generations and species.

## Demo

![Demo](./demo.gif)

## Neural network inputs/output

The inputs for the neural network are:
 1. Hight of the bird relative to the bottom pipe
 2. Distance of the bird to the next pipes
 3. The birds current vertical velocity (Y-Axis)
 4. Bias

Output of the neural network should the bird "flap" in the current situation.
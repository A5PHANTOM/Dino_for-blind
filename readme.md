# Accessible Audio BLOCK Game

An accessible web-based endless runner game specifically designed for blind, visually impaired, **cognitive, and learning disabled** players. This game reimagines the classic Chrome Dinosaur game using advanced audio cues, speech synthesis, and simplified mechanics to create an inclusive gaming experience for users with diverse abilities.

## 🎯 Project Overview

This project addresses the lack of accessible gaming options for users with visual, cognitive, and learning disabilities by creating an audio-first gaming experience with simplified controls and clear feedback. Instead of relying on complex visual cues or rapid decision-making, players use intuitive sound patterns, consistent controls, and supportive audio guidance to navigate obstacles and play successfully.

## ✨ Key Features

### 🔊 Advanced Audio System
- **Proximity Sound System**: Audio frequency increases as obstacles approach, allowing precise timing
- **Jump Confirmation**: Audio feedback confirms successful jumps
- **Score Notifications**: Pleasant tones when passing obstacles
- **Game State Announcements**: Speech synthesis for all game events

### 🎮 Accessible Controls
- **Single Key Control**: Space bar for both starting the game and jumping
- **Alternative Jump Key**: Up arrow also available during gameplay
- **Click Support**: Mouse/touch support for additional accessibility
- **Consistent Interface**: Same control pattern throughout the game

### 🗣️ Speech Integration
- **Continuous Audio Prompts**: Repeating "Press Space to start" until game begins
- **Real-time Feedback**: Jump confirmations and game status updates
- **Score Announcements**: Final score spoken at game over
- **Clear Instructions**: Built-in voice guidance with simple language

### 🧠 Cognitive Accessibility Features
- **Simple Controls**: Only one key needed to play
- **Predictable Patterns**: Consistent audio cues and timing
- **Clear Feedback**: Immediate confirmation of all actions
- **No Time Pressure**: Players can take time to understand audio cues
- **Forgiving Gameplay**: Enhanced jump height and obstacle spacing

### ⚙️ Customization Options
- **Sound Toggle**: Enable/disable audio effects while keeping speech
- **Difficulty Scaling**: Game speed increases progressively with score
- **Obstacle Spacing**: Optimized distances for accessibility

## 🚀 Getting Started

### Prerequisites
- Modern web browser with Web Audio API support
- Speakers or headphones (essential for gameplay)
- JavaScript enabled
- No prior gaming experience required

### Installation

1. **Download the Game**

2. **Open in Browser**
- Double-click the HTML file, or
- Open your browser and drag the file into the window, or
- Use a local web server for best compatibility

3. **Enable Audio**
- Ensure your browser allows audio playback
- Use headphones or speakers for optimal experience

## 🎮 How to Play

### Starting the Game
1. Open the game in your browser
2. Listen for the audio prompt "Press Space to start playing"
3. Press the **Space bar** to begin

### Gameplay Controls
- **Space Bar**: Jump over obstacles
- **Up Arrow**: Alternative jump key
- **Mouse Click**: Click anywhere on the game area to jump

### Audio Cues (Simplified Explanation)
- **Quiet**: No obstacles nearby - keep running
- **Getting Louder**: Obstacle coming closer
- **Very Loud**: Time to jump!
- **Jump Sound**: You jumped successfully
- **Happy Chime**: You passed an obstacle - great job!

### Learning Strategy
- Start by just listening to the sounds
- Practice jumping when you hear the loudest tone
- Don't worry about scores initially - focus on the audio patterns
- Take breaks whenever needed

## 🛠️ Technical Details

### Built With
- **HTML5 Canvas**: Visual representation (optional)
- **Web Audio API**: Advanced audio synthesis and control
- **Speech Synthesis API**: Voice announcements and instructions
- **Vanilla JavaScript**: No external dependencies

### Browser Compatibility
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Older browsers may have limited audio support

### Performance Notes
- Optimized for low-latency audio response
- Minimal CPU usage for smooth gameplay
- Works on desktop and mobile devices

## 🔧 Configuration Options

The game includes several built-in settings:

| Feature | Default Value | Description |
|---------|---------------|-------------|
| Obstacle Spacing | 160 frames | Distance between obstacles |
| Jump Power | -15 pixels | Height of dinosaur jump |
| Audio Frequency | 200-800 Hz | Range for proximity detection |
| Prompt Interval | 3 seconds | Frequency of start prompts |

## ♿ Accessibility Features

### Universal Design Principles
- **Audio-First Design**: Game fully playable without visual elements
- **Clear Instructions**: Spoken tutorials and guidance in simple language
- **Consistent Controls**: Single-key interaction model
- **Error Prevention**: Audio warnings before collisions
- **Flexible Interaction**: Multiple input methods supported

### **Cognitive & Learning Disability Support**
- **Simple Mechanics**: Only one action required (jumping)
- **Predictable Patterns**: Consistent audio-obstacle relationships
- **No Complex Rules**: Straightforward gameplay without confusing elements
- **Patient Design**: No penalties for taking time to learn
- **Positive Reinforcement**: Encouraging sounds and messages
- **Memory Support**: Repeating audio cues help with retention
- **Reduced Cognitive Load**: Minimal multitasking required
- **Clear Success/Failure**: Obvious audio feedback for all outcomes

### Screen Reader Compatibility
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management

## 🎯 Benefits for Different User Groups

### **For Cognitive/Learning Disabilities:**
- **Develops Timing Skills**: Audio-based reaction training
- **Builds Confidence**: Simple success mechanics
- **Improves Focus**: Single-task concentration practice
- **Enhances Pattern Recognition**: Consistent audio cues
- **Stress-Free Learning**: No complex rules or penalties

### **For Visual Impairments:**
- **Spatial Awareness**: Audio positioning training
- **Reaction Time**: Sound-based timing skills
- **Independence**: Self-guided gaming experience

### **For Motor Impairments:**
- **Single Key Operation**: Minimal physical requirements
- **Alternative Inputs**: Multiple control options
- **Forgiving Timing**: Enhanced jump mechanics

## 🐛 Troubleshooting

### Common Issues

**No Audio Playing**
- Check browser audio permissions
- Ensure system volume is up
- Try refreshing the page
- Test with headphones

**Game Won't Start**
- Press Space bar (not Enter)
- Ensure JavaScript is enabled
- Try in a different browser
- Check browser console for errors

**Performance Issues**
- Close other browser tabs
- Disable browser extensions
- Use Chrome for best performance
- Check system audio drivers

**Too Difficult/Fast**
- Focus on audio patterns first, ignore score
- Take breaks between attempts
- Practice just listening without playing initially

## 🔄 Future Enhancements

- [ ] Multiple difficulty levels with cognitive considerations
- [ ] Customizable audio themes for different learning styles
- [ ] Progress tracking for skill development
- [ ] Tutorial mode with step-by-step audio guidance
- [ ] Slower game modes for learning
- [ ] Achievement system for motivation
- [ ] Caregiver/teacher dashboard for progress monitoring
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Additional obstacle types
- [ ] Social features for inclusive gaming community

## 🤝 Contributing

We welcome contributions that improve accessibility and gameplay for all ability levels:

1. **Accessibility Testing**: Feedback from users with disabilities
2. **Cognitive Load Assessment**: Input from learning disability specialists
3. **User Experience**: Suggestions for simplification
4. **Educational Value**: Ideas for skill-building features
5. **Bug Reports**: Open issues for any problems
6. **Feature Requests**: Suggest accessibility improvements
7. **Code Contributions**: Submit pull requests
8. **Documentation**: Help improve instructions and clarity

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by Chrome's offline dinosaur game
- Built with accessibility-first design principles
- Thanks to the blind gaming community for feedback and testing
- **Special recognition to cognitive accessibility advocates**
- **Appreciation for learning disability support organizations**

## 📞 Support

For support, feedback, or accessibility suggestions:
- Open a GitHub issue
- Contact the development team
- Join our inclusive gaming community

**Made with ♿ for universal access to gaming**

*This game proves that with thoughtful design, everyone can enjoy the thrill of gaming, regardless of visual, cognitive, or learning abilities. Gaming should be inclusive, supportive, and accessible to all.*

## 🧠 Additional Resources for Cognitive/Learning Disabilities

- **Getting Started Guide**: Simple step-by-step instructions
- **Audio Pattern Examples**: Sample sounds to practice with
- **Caregiver Instructions**: How to support players with cognitive disabilities
- **Educational Benefits**: How gaming can support learning and development

---

**Key Accessibility Features Summary:**
- ♿ **Visual**: Full audio-based gameplay
- 🧠 **Cognitive**: Simple controls and clear patterns
- 🎓 **Learning**: Educational timing and focus skills
- 🖱️ **Motor**: Single-key operation with alternatives
- 🌍 **Universal**: Inclusive design for all abilities

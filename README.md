# Neural Network Architectures – Educational Visualizations

## Simple One-Connection Network (Line Through Origin)
This project starts with the most minimal neural network idea: one input node, one output node, and a single connection between them. Conceptually, this represents a transformation that would pass through the origin (if no signal goes in, none comes out). No numeric values are shown intentionally to keep focus on the structural idea rather than calculation.

### Files
- `index.html` – Root page containing the SVG visualization and UI controls.
- `styles.css` – Light theme styling and layout.
- `script.js` – Animation logic for a "signal" traveling from input to output.

### How to View
Open `index.html` directly in a modern browser:

```
firefox index.html
# or
google-chrome index.html
```

### Interaction
Click the "Send a Signal" button to animate a red traveler dot:
1. It approaches the input node.
2. It moves along the connection (representing the transformation).
3. It exits past the output node.

### Accessibility & Motion
- Reduced motion preferences are respected (no complex transitions beyond essentials).
- SVG elements include labeling for assistive technologies.

### Next Ideas (Future Extensions)
Potential expansions (not implemented yet):
- Multiple inputs combining into one output.
- Adding hidden nodes (layers) visually.
- Different connection styles to indicate conceptual changes (e.g., strengthening, gating) without numbers.

---
Educational use only. No computation or numeric training is performed.
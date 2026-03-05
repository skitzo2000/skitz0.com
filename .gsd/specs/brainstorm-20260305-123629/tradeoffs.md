# Trade-off Decisions

## Graph Rendering: Sigma.js (WebGL)
- **Chosen**: Sigma.js — GPU-accelerated graph rendering
- **Why**: User wants a visually impressive, performant graph that can handle the full career map with drill-down
- **Trade-off accepted**: More complex setup, but the visual payoff is worth it for a portfolio showcase
- **Note**: graphology library pairs with Sigma.js for graph data structure management

## GitHub Content: Client-side Fetch
- **Chosen**: Client-side fetching via GitHub REST API
- **Why**: Always-fresh content without rebuild triggers
- **Trade-offs accepted**:
  - Rate limiting (60 req/hr unauthenticated, 5000 with token)
  - Need loading states / skeletons
  - Slight delay on page load
- **Mitigation**: Cache responses in localStorage, use public API with optional token

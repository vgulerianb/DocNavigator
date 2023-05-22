import React from 'react';

function Icon() {
  return (
    <svg width="30" height="30" fill="#1e88e5" data-testid="grid-svg" viewBox="0 0 105 105">
      <circle cx="12.5" cy="12.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="0s"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="12.5" cy="52.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="100ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="52.5" cy="12.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="300ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="52.5" cy="52.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="600ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="92.5" cy="12.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="800ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="92.5" cy="52.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="400ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="12.5" cy="92.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="700ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="52.5" cy="92.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="500ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
      <circle cx="92.5" cy="92.5" r="5">
        <animate
          attributeName="fill-opacity"
          begin="200ms"
          calcMode="linear"
          dur="1s"
          repeatCount="indefinite"
          values="1;.2;1"
        ></animate>
      </circle>
    </svg>
  );
}

export default Icon;

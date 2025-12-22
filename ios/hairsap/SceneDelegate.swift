import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

  var window: UIWindow?

  // 🔗 URL Scheme
  func scene(
    _ scene: UIScene,
    openURLContexts URLContexts: Set<UIOpenURLContext>
  ) {
    guard let url = URLContexts.first?.url else { return }

    RCTLinkingManager.application(
      UIApplication.shared,
      open: url,
      options: [:]
    )
  }

  // 🔗 Universal Links
  func scene(
    _ scene: UIScene,
    continue userActivity: NSUserActivity
  ) {
    RCTLinkingManager.application(
      UIApplication.shared,
      continue: userActivity,
      restorationHandler: { _ in }
    )
  }
}

#import <React/RCTBridgeModule.h>
#import <React/RCTReloadCommand.h>

// Triggers a reload the same way react-native-code-push does on rollback
// (CodePush.m -loadBundle): async on the main queue.
@interface ReproReload : NSObject <RCTBridgeModule>
@end

@implementation ReproReload

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(reload)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTTriggerReloadCommandListeners(@"repro: reload during first bundle evaluation");
  });
}

@end

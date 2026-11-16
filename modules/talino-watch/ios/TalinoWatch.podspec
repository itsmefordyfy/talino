Pod::Spec.new do |s|
  s.name           = 'TalinoWatch'
  s.version        = '1.0.0'
  s.summary        = 'The iPhone side of Talino\'s Apple Watch app'
  s.description    = 'Pushes the latest snapshot to the Watch and hands the Watch\'s commands to the app.'
  s.license        = 'MIT'
  s.author         = 'Talino'
  s.homepage       = 'https://github.com/expo/expo'
  s.platforms      = {
    :ios => '16.4'
  }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.{h,m,swift}"
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end

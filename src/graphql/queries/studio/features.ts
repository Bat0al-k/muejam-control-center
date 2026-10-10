// export const GET_STUDIO_FEATURE_UTILIZATION = `
//     query GetStudioFeatureUtilization {
//         Voice_Studio_ai_usage {
//         id
//         operation
//         model
//         total_cost_usd
//         created_at
//         }

//         Voice_Studio_voice_generations {
//         id
//         voice_name
//         provider
//         model_id
//         created_at
//         }
//     }
// `;


// export const GET_STUDIO_FEATURE_UTILIZATION = `
//     query GetStudioFeatureUtilization(
//         $startDate: timestamptz!
//         $endDate: timestamptz!
//     ) {
//         Voice_Studio_ai_usage(
//         where: {
//             created_at: {
//             _gte: $startDate
//             _lt: $endDate
//             }
//         }
//         ) {
//         id
//         operation
//         model
//         total_cost_usd
//         created_at
//         }

//         Voice_Studio_voice_generations(
//         where: {
//             created_at: {
//             _gte: $startDate
//             _lt: $endDate
//             }
//         }
//         ) {
//         id
//         voice_name
//         provider
//         model_id
//         created_at
//         }

//         Voice_Studio_videos(
//         where: {
//             created_at: {
//             _gte: $startDate
//             _lt: $endDate
//             }
//         }
//         ) {
//         id
//         created_at
//         }

//         Voice_Studio_semantic_images(
//         where: {
//             created_at: {
//             _gte: $startDate
//             _lt: $endDate
//             }
//         }
//         ) {
//         id
//         created_at
//         status
//         model_version
//         }
//     }
// `;


export const GET_STUDIO_FEATURE_UTILIZATION = `
    query GetStudioFeatureUtilization(
        $startDate: timestamptz!
        $endDate: timestamptz!
    ) {
        aiTextSummary: Voice_Studio_ai_usage_aggregate(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
        ) {
            aggregate {
                count
                sum {
                    total_tokens
                    total_cost_usd
                }
            }
        }

        aiTextRecent: Voice_Studio_ai_usage(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
            order_by: { created_at: desc }
            limit: 5
        ) {
            id
            operation
            model
            prompt_tokens
            completion_tokens
            total_tokens
            total_cost_usd
            created_at
        }

        voiceSummary: Voice_Studio_voice_generations_aggregate(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
        ) {
            aggregate {
                count
            }
        }

        voiceRecent: Voice_Studio_voice_generations(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
            order_by: { created_at: desc }
            limit: 5
        ) {
            id
            voice_name
            provider
            model_id
            text_content
            created_at
        }

        videoSummary: Voice_Studio_videos_aggregate(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
        ) {
            aggregate {
                count
            }
        }

        videoRecent: Voice_Studio_videos(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
            order_by: { created_at: desc }
            limit: 5
        ) {
            id
            title
            duration
            url
            created_at
        }

        imageSummary: Voice_Studio_semantic_images_aggregate(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
        ) {
            aggregate {
                count
            }
        }

        indexedImageSummary: Voice_Studio_semantic_images_aggregate(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                },
                status: { _eq: "indexed" },
                is_active: { _eq: true }
            }
        ) {
            aggregate {
                count
            }
        }

        imageRecent: Voice_Studio_semantic_images(
            where: {
                created_at: {
                    _gte: $startDate
                    _lt: $endDate
                }
            }
            order_by: { created_at: desc }
            limit: 5
        ) {
            id
            name
            category
            width
            height
            mime_type
            size_bytes
            status
            model_version
            indexed_at
            created_at
            error_message
        }
    }
`;

export const GET_STUDIO_IMAGE_GENERATION_METRICS = `
    query GetStudioImageGenerationMetrics {
        Studio_image_generation_metrics(
        last: 10
        ) {
        total_cost_usd
        total_images_generated
        average_generation_time_seconds
        highest_cost_image_usd
        }
    }
`;

export const GET_STUDIO_IMAGE_GENERATION_DETAILS = `
    query GetStudioImageGenerationDetails {
        Studio_image_generation_details(
        last: 10
        ) {
        id
        prompt
        resolution
        style
        cost_usd
        image_url
        error_message
        created_at
        }
    }
`;

export const GET_STUDIO_VIDEO_GENERATION_METRICS = `
    query GetStudioVideoGenerationMetrics {
        Studio_video_generation_metrics(
        last: 10
        ) {
        total_cost_usd
        total_videos_generated
        average_video_duration_seconds
        highest_cost_video_usd
        }
    }
`;

export const GET_STUDIO_VIDEO_GENERATION_DETAILS = `
    query GetStudioVideoGenerationDetails {
        Studio_video_generation_details(
        last: 10
        ) {
        id
        prompt
        resolution
        duration_seconds
        cost_usd
        video_url
        error_message
        created_at
        }
    }
`;

export const GET_STUDIO_VOICE_GENERATION_DETAILS = `
  query GetStudioVoiceGenerationDetails {
    Voice_Studio_voice_generations(
      last: 10
    ) {
      id
      voice_name
      text
      duration_seconds
      cost_usd
      audio_url
      error_message
      created_at
    }
  }
`;

export const GET_STUDIO_REALTIME_GENERATION_DETAILS = `
  query GetStudioRealtimeGenerationDetails {
    Voice_Studio_realtime_sessions(
      last: 10
    ) {
      id
      voice_name
      duration_seconds
      cost_usd
      created_at
    }
  }
`;

export const GET_STUDIO_AI_USAGE_METRICS = `
  query GetStudioAiUsageMetrics {
    Voice_Studio_ai_usage(
      last: 10
    ) {
      total_cost_usd
      total_operations
      average_operation_time_seconds
    }
  }
`;

export const GET_STUDIO_AI_USAGE_DETAILS = `
  query GetStudioAiUsageDetails {
    Voice_Studio_ai_usage(
      last: 10
    ) {
      id
      operation
      model
      total_cost_usd
      created_at
    }
  }
`;

export const GET_STUDIO_REALTIME_GENERATION_METRICS = `
  query GetStudioRealtimeGenerationMetrics {
    Voice_Studio_realtime_sessions(
      last: 10
    ) {
      total_cost_usd
      total_sessions
      average_session_duration_seconds
    }
  }
`;